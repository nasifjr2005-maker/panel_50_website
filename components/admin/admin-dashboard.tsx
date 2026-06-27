"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Boxes, FileQuestion, Globe2, ImageIcon, KeyRound, LayoutDashboard, LogOut, MessageSquare, Save, Search, Settings, ShoppingBag, Star, Trash2, Upload } from "lucide-react";
import type { AdminCommunityLink, AdminContent, AdminFAQ, AdminOrder, AdminPrice, AdminProduct, AdminStore, AdminTestimonial } from "@/lib/admin-types";

const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Boxes },
  { id: "pricing", label: "Pricing", icon: BarChart3 },
  { id: "media", label: "Media Library", icon: ImageIcon },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "faq", label: "FAQ", icon: FileQuestion },
  { id: "community", label: "Community Links", icon: Globe2 },
  { id: "content", label: "Content Manager", icon: MessageSquare },
  { id: "auth", label: "Auth Settings", icon: KeyRound },
  { id: "settings", label: "Settings", icon: Settings }
];

function emptyPrice(): AdminPrice {
  return { id: crypto.randomUUID(), duration: "", bdt: 0, usd: "$0", sortOrder: 0 };
}

function getFeaturedMedia(product: AdminProduct) {
  return product.media.find((item) => item.type === "image" && (item.isFeatured || item.id === product.featuredImageId)) ??
    product.media.find((item) => item.type === "image");
}

function setFormValue(form: HTMLFormElement, name: string, value: string | boolean | number) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement) {
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = String(value);
    }
    return;
  }

  if (field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    field.value = String(value);
  }
}

export function AdminDashboard() {
  const [store, setStore] = useState<AdminStore | null>(null);
  const [active, setActive] = useState("dashboard");
  const [query, setQuery] = useState("");

  async function load() {
    const response = await fetch("/api/admin/store", { cache: "no-store" });
    setStore(await response.json());
  }

  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const hasFreshLogin = window.sessionStorage.getItem("panel50_admin_fresh_login") === "1";
    if (navigation?.type === "reload" || !hasFreshLogin) {
      window.sessionStorage.removeItem("panel50_admin_fresh_login");
      navigator.sendBeacon?.("/api/admin/logout", new Blob([], { type: "application/json" }));
      window.location.replace("/admin/login");
      return;
    }

    window.sessionStorage.removeItem("panel50_admin_fresh_login");
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const products = useMemo(() => store?.categories.flatMap((category) => category.products) ?? [], [store]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!store) {
    return <main className="min-h-screen p-6 text-white">Loading admin dashboard...</main>;
  }

  return (
    <main className="min-h-screen text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-[#07091f]/88 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-5">
          <h1 className="text-2xl font-bold uppercase">PANEL 50 Admin</h1>
          <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#7cb0ff]">Owner CMS</p>
          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:grid lg:overflow-visible lg:pb-0">
            {menu.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setActive(id)} className={`flex shrink-0 items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-bold uppercase transition lg:text-base ${active === id ? "bg-[#4382DF] text-white shadow-[0_0_28px_rgba(67,130,223,0.35)]" : "text-[#c8d1f3] hover:bg-white/8 hover:text-white"}`}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
          <button onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/8 px-4 py-3 font-bold uppercase transition hover:border-red-200/50 hover:bg-red-500/15 lg:mt-8">
            <LogOut size={18} aria-hidden="true" />
            Logout
          </button>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7cb0ff]">Secure owner dashboard</p>
              <h2 className="mt-2 break-words text-3xl font-bold uppercase sm:text-4xl">{menu.find((item) => item.id === active)?.label}</h2>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7cb0ff]" size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders/products..." className="min-h-11 w-full rounded-md border border-white/12 bg-[#090b24] pl-10 pr-4 outline-none transition focus:border-[#4382DF]" />
            </div>
          </div>

          {active === "dashboard" ? <DashboardOverview store={store} products={products} /> : null}
          {active === "products" ? <ProductsPanel store={store} reload={load} /> : null}
          {active === "pricing" ? <PricingPanel products={products} reload={load} /> : null}
          {active === "media" ? <MediaPanel store={store} products={products} reload={load} /> : null}
          {active === "orders" ? <OrdersPanel orders={store.orders} query={query} reload={load} /> : null}
          {active === "testimonials" ? <TestimonialsPanel items={store.testimonials} reload={load} /> : null}
          {active === "faq" ? <FaqPanel items={store.faqs} reload={load} /> : null}
          {active === "community" ? <CommunityLinksPanel items={store.communityLinks} reload={load} /> : null}
          {active === "content" ? <ContentPanel content={store.content} reload={load} /> : null}
          {active === "auth" ? <AuthSettingsPanel store={store} reload={load} /> : null}
          {active === "settings" ? <SettingsPanel store={store} reload={load} /> : null}
        </section>
      </div>
    </main>
  );
}

function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-lg p-5 ${className}`}>{children}</div>;
}

function DashboardOverview({ store, products }: { store: AdminStore; products: AdminProduct[] }) {
  const cards = [
    ["Total Products", products.length],
    ["Total Categories", store.categories.length],
    ["Pending Orders", store.orders.filter((order) => order.status === "pending").length],
    ["Media Files", store.media.length]
  ];
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <AdminCard key={label}>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#aeb8df]">{label}</p>
            <p className="mt-2 text-4xl font-bold">{value}</p>
          </AdminCard>
        ))}
      </div>
      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Recent Updates</h3>
        <div className="mt-4 grid gap-2 text-[#c8d1f3]">
          {(store.recentUpdates.length ? store.recentUpdates : ["No updates yet"]).map((item) => <p key={item}>{item}</p>)}
        </div>
        <p className="mt-5 text-sm uppercase tracking-[0.14em] text-[#7cb0ff]">Last Login: {store.lastLogin ? new Date(store.lastLogin).toLocaleString() : "Not recorded"}</p>
      </AdminCard>
    </div>
  );
}

function ProductsPanel({ store, reload }: { store: AdminStore; reload: () => Promise<void> }) {
  const categoryFormRef = useRef<HTMLFormElement>(null);
  const productFormRef = useRef<HTMLFormElement>(null);

  function editCategory(category: AdminStore["categories"][number]) {
    const form = categoryFormRef.current;
    if (!form) return;
    setFormValue(form, "id", category.id);
    setFormValue(form, "name", category.name);
    setFormValue(form, "description", category.description);
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function editProduct(product: AdminProduct) {
    const form = productFormRef.current;
    if (!form) return;
    setFormValue(form, "id", product.id);
    setFormValue(form, "name", product.name);
    setFormValue(form, "description", product.description);
    setFormValue(form, "categoryId", product.categoryId);
    setFormValue(form, "enabled", product.enabled);
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.get("id") || undefined,
        name: form.get("name"),
        description: form.get("description")
      })
    });
    event.currentTarget.reset();
    await reload();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.get("id") || undefined,
        name: form.get("name"),
        description: form.get("description"),
        categoryId: form.get("categoryId"),
        enabled: form.get("enabled") === "on"
      })
    });
    event.currentTarget.reset();
    await reload();
  }

  return (
    <div className="grid gap-5">
      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Add or Edit Category</h3>
        <form ref={categoryFormRef} onSubmit={submitCategory} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <input name="id" placeholder="Existing category ID for edit" className="admin-input" />
          <input name="name" required placeholder="Category name" className="admin-input" />
          <button className="rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase">Save Category</button>
          <textarea name="description" placeholder="Category description" className="admin-input md:col-span-3" />
        </form>
      </AdminCard>
      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Add or Edit Product</h3>
        <form ref={productFormRef} onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-4">
          <input name="id" placeholder="Existing ID for edit" className="admin-input" />
          <input name="name" required placeholder="Product name" className="admin-input" />
          <select name="categoryId" required className="admin-input">
            {store.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm font-bold uppercase text-[#c8d1f3]"><input name="enabled" type="checkbox" defaultChecked /> Enabled</label>
          <textarea name="description" placeholder="Description" className="admin-input md:col-span-3" />
          <button className="rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase">Save Product</button>
        </form>
      </AdminCard>
      <div className="grid gap-4">
        {store.categories.map((category) => (
          <AdminCard key={category.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-xl font-bold uppercase">{category.name}</h4>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#aeb8df]">ID: {category.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => editCategory(category)} className="rounded-md border border-white/15 px-3 py-2 text-sm font-bold uppercase transition hover:border-[#7cb0ff] hover:bg-[#4382DF]/15">Edit Category</button>
                {category.products.length === 0 ? <DeleteButton url={`/api/admin/categories?id=${category.id}`} reload={reload} label="Delete Category" /> : null}
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead className="text-sm uppercase tracking-[0.12em] text-[#7cb0ff]"><tr><th>Logo</th><th>Name</th><th>Description</th><th>Status</th><th>ID</th><th /></tr></thead>
                <tbody>
                  {category.products.map((product) => {
                    const featuredMedia = getFeaturedMedia(product);
                    return (
                      <tr key={product.id} className="border-t border-white/10">
                        <td className="py-3">
                          <span className="flex size-12 items-center justify-center rounded-md border border-white/12 bg-white/8 p-1.5">
                            {featuredMedia ? <img src={featuredMedia.url} alt="" className="h-full w-full rounded-sm object-contain" /> : <ImageIcon size={20} className="text-[#7cb0ff]" aria-hidden="true" />}
                          </span>
                        </td>
                        <td className="py-3 font-bold">{product.name}</td>
                        <td className="max-w-md py-3 text-[#c8d1f3]">{product.description}</td>
                        <td className="py-3">{product.enabled ? "Enabled" : "Disabled"}</td>
                        <td className="py-3 text-xs text-[#aeb8df]">{product.id}</td>
                        <td className="py-3">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => editProduct(product)} className="rounded-md border border-white/15 px-3 py-2 text-sm font-bold uppercase transition hover:border-[#7cb0ff] hover:bg-[#4382DF]/15">Edit</button>
                            <DeleteButton url={`/api/admin/products?id=${product.id}`} reload={reload} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

function PricingPanel({ products, reload }: { products: AdminProduct[]; reload: () => Promise<void> }) {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const product = products.find((item) => item.id === selectedId) ?? products[0];
  const [prices, setPrices] = useState<AdminPrice[]>(product?.prices ?? []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPrices(product?.prices ?? []);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [product?.id, product?.prices]);

  async function save() {
    await fetch("/api/admin/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, prices }) });
    await reload();
  }

  if (!product) return <AdminCard>No products yet.</AdminCard>;

  return (
    <AdminCard>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <label className="grid w-full max-w-xl gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#aeb8df]">
          Product
          <select value={product.id} onChange={(event) => setSelectedId(event.target.value)} className="admin-input">
            {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <p className="text-sm uppercase tracking-[0.12em] text-[#7cb0ff]">{prices.length} durations</p>
      </div>
      <div className="mt-5 grid gap-3">
        {prices.map((price, index) => (
          <div key={price.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/7 p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input value={price.duration} onChange={(event) => setPrices(prices.map((item, i) => i === index ? { ...item, duration: event.target.value } : item))} className="admin-input" placeholder="Duration" />
            <input value={price.bdt} type="number" onChange={(event) => setPrices(prices.map((item, i) => i === index ? { ...item, bdt: Number(event.target.value) } : item))} className="admin-input" placeholder="BDT" />
            <input value={price.usd} onChange={(event) => setPrices(prices.map((item, i) => i === index ? { ...item, usd: event.target.value } : item))} className="admin-input" placeholder="USD" />
            <button onClick={() => setPrices(prices.filter((_, i) => i !== index))} className="min-h-12 rounded-md border border-red-300/30 px-4 text-red-100">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => setPrices([...prices, emptyPrice()])} className="rounded-md border border-white/15 px-5 py-3 font-bold uppercase">Add Duration</button>
        <button onClick={save} className="rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase">Save Pricing</button>
      </div>
    </AdminCard>
  );
}

function MediaPanel({ store, products, reload }: { store: AdminStore; products: AdminProduct[]; reload: () => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedLogoProductId, setSelectedLogoProductId] = useState("");
  const logoProductId = selectedLogoProductId || products[0]?.id || "";

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await fetch("/api/admin/media", { method: "POST", body: form });
    formRef.current?.reset();
    await reload();
  }

  async function setAsLogo(mediaId: string) {
    if (!logoProductId) {
      return;
    }

    await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, productId: logoProductId })
    });
    await reload();
  }

  return (
    <div className="grid gap-5">
      <AdminCard>
        <form ref={formRef} onSubmit={upload} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <select name="productId" className="admin-input"><option value="">General media</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
          <input name="files" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.mp4,.webm" className="admin-input" />
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase"><Upload size={18} /> Upload</button>
          <label className="flex items-center gap-2 text-sm font-bold uppercase text-[#c8d1f3] md:col-span-3">
            <input name="isFeatured" type="checkbox" />
            Use uploaded image as product logo / featured image
          </label>
        </form>
      </AdminCard>
      <AdminCard>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 className="text-2xl font-bold uppercase">Logo Assignment</h3>
            <p className="mt-2 text-[#aeb8df]">Select a product, then use Set As Logo on any uploaded image below.</p>
          </div>
          <select value={logoProductId} onChange={(event) => setSelectedLogoProductId(event.target.value)} className="admin-input min-w-64">
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </div>
      </AdminCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {store.media.map((item) => (
          <AdminCard key={item.id}>
            <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[#090b24] p-2">
              {item.type === "video" ? <video src={item.url} controls className="h-full w-full rounded-md bg-black object-contain" /> : <img src={item.url} alt={item.name} className="h-full w-full rounded-md object-contain" />}
            </div>
            <p className="mt-3 break-words font-bold">{item.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#aeb8df]">
              {item.productId ? products.find((product) => product.id === item.productId)?.name ?? "Assigned product" : "General media"}
              {item.isFeatured ? " | Featured" : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.type === "image" ? (
                <button type="button" onClick={() => setAsLogo(item.id)} className="rounded-md border border-white/15 px-3 py-2 text-sm font-bold uppercase transition hover:border-[#7cb0ff] hover:bg-[#4382DF]/15">Set As Logo</button>
              ) : null}
              <DeleteButton url={`/api/admin/media?id=${item.id}`} reload={reload} />
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

function OrdersPanel({ orders, query, reload }: { orders: AdminOrder[]; query: string; reload: () => Promise<void> }) {
  const filtered = orders.filter((order) => `${order.name} ${order.productName} ${order.whatsapp ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <AdminCard>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="text-sm uppercase tracking-[0.12em] text-[#7cb0ff]"><tr><th>Customer</th><th>Contact</th><th>Product</th><th>Price</th><th>Date</th><th>Status</th><th /></tr></thead>
          <tbody>{filtered.map((order) => <tr key={order.id} className="border-t border-white/10"><td className="py-3">{order.name}</td><td>{order.email || order.whatsapp}</td><td>{order.productName} / {order.duration}</td><td>{order.bdt} BDT ({order.usd})</td><td>{new Date(order.createdAt).toLocaleString()}</td><td>{order.status}</td><td className="flex gap-2 py-3"><button onClick={async () => { await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: order.id, status: order.status === "pending" ? "completed" : "pending" }) }); await reload(); }} className="rounded-md border border-white/15 px-3 py-2">Toggle</button><DeleteButton url={`/api/admin/orders?id=${order.id}`} reload={reload} /></td></tr>)}</tbody>
        </table>
      </div>
    </AdminCard>
  );
}

function FaqPanel({ items, reload }: { items: AdminFAQ[]; reload: () => Promise<void> }) {
  const [faqs, setFaqs] = useState(items);
  useEffect(() => {
    const timer = window.setTimeout(() => setFaqs(items), 0);
    return () => window.clearTimeout(timer);
  }, [items]);
  async function save() {
    await fetch("/api/admin/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(faqs) });
    await reload();
  }
  return <ListEditor title="FAQ" items={faqs} setItems={setFaqs} save={save} fields={["question", "answer"]} newItem={{ id: crypto.randomUUID(), question: "", answer: "", enabled: true, sortOrder: faqs.length }} />;
}

function TestimonialsPanel({ items, reload }: { items: AdminTestimonial[]; reload: () => Promise<void> }) {
  const [testimonials, setTestimonials] = useState(items);
  useEffect(() => {
    const timer = window.setTimeout(() => setTestimonials(items), 0);
    return () => window.clearTimeout(timer);
  }, [items]);
  async function save() {
    await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(testimonials) });
    await reload();
  }
  return <ListEditor title="Testimonials" items={testimonials} setItems={setTestimonials} save={save} fields={["name", "role", "quote"]} newItem={{ id: crypto.randomUUID(), name: "", role: "", quote: "", enabled: true }} />;
}

function emptyCommunityLink(index: number): AdminCommunityLink {
  return {
    id: crypto.randomUUID(),
    title: "",
    href: "",
    description: "",
    logoUrl: "",
    accent: "blue",
    enabled: true,
    sortOrder: index
  };
}

function CommunityLinksPanel({ items, reload }: { items: AdminCommunityLink[]; reload: () => Promise<void> }) {
  const [links, setLinks] = useState(items);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setLinks(items), 0);
    return () => window.clearTimeout(timer);
  }, [items]);

  function updateLink(index: number, patch: Partial<AdminCommunityLink>) {
    setLinks(links.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  async function save() {
    setMessage("");
    await fetch("/api/admin/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(links.map((link, index) => ({ ...link, sortOrder: index })))
    });
    setMessage("Community links updated on the live website.");
    await reload();
  }

  return (
    <div className="grid gap-5">
      <AdminCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold uppercase">Community Link Manager</h3>
            <p className="mt-2 text-[#aeb8df]">Add future social platforms, support channels, groups, or showcase pages. Use uploaded media URLs from the Media Library for custom logos.</p>
          </div>
          <button onClick={() => setLinks([...links, emptyCommunityLink(links.length)])} className="rounded-md border border-white/15 px-5 py-3 font-bold uppercase transition hover:border-[#4382DF] hover:bg-[#4382DF]/15">Add Link</button>
        </div>
      </AdminCard>

      <div className="grid gap-4">
        {links.map((link, index) => (
          <AdminCard key={link.id}>
            <div className="grid gap-4 lg:grid-cols-[72px_1fr_auto] lg:items-start">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-md border border-white/12 bg-white/8">
                {link.logoUrl ? <img src={link.logoUrl} alt="" className="h-full w-full object-contain" /> : <Globe2 className="text-[#7cb0ff]" size={28} />}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={link.title} onChange={(event) => updateLink(index, { title: event.target.value })} className="admin-input" placeholder="Platform title, e.g. Telegram" />
                <input value={link.href} onChange={(event) => updateLink(index, { href: event.target.value })} className="admin-input" placeholder="https://..." />
                <input value={link.logoUrl} onChange={(event) => updateLink(index, { logoUrl: event.target.value })} className="admin-input" placeholder="Logo URL or uploaded media URL" />
                <select value={link.accent} onChange={(event) => updateLink(index, { accent: event.target.value })} className="admin-input">
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="indigo">Indigo</option>
                  <option value="emerald">Emerald</option>
                  <option value="violet">Violet</option>
                </select>
                <textarea value={link.description} onChange={(event) => updateLink(index, { description: event.target.value })} className="admin-input min-h-24 md:col-span-2" placeholder="Short description shown on the community card" />
                <label className="flex items-center gap-2 text-sm font-bold uppercase text-[#c8d1f3]">
                  <input type="checkbox" checked={link.enabled} onChange={(event) => updateLink(index, { enabled: event.target.checked })} />
                  Show on website
                </label>
              </div>
              <button onClick={() => setLinks(links.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-300/30 px-4 py-3 text-red-100 transition hover:bg-red-500/12">
                <Trash2 size={18} />
                Remove
              </button>
            </div>
          </AdminCard>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={save} className="inline-flex items-center gap-2 rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase"><Save size={18} /> Save Community Links</button>
        {message ? <p className="text-emerald-100">{message}</p> : null}
      </div>
    </div>
  );
}

function ContentPanel({ content, reload }: { content: AdminContent; reload: () => Promise<void> }) {
  const [draft, setDraft] = useState(content);
  const textFields: Array<{ key: keyof AdminContent; label: string; multiline?: boolean }> = [
    { key: "heroEyebrow", label: "Hero Eyebrow" },
    { key: "heroHeadline", label: "Hero Headline" },
    { key: "heroSubheadline", label: "Hero Subheadline", multiline: true },
    { key: "primaryCta", label: "Primary CTA" },
    { key: "secondaryCta", label: "Secondary CTA" },
    { key: "featuresEyebrow", label: "Panels Eyebrow" },
    { key: "featuresTitle", label: "Panels Title" },
    { key: "featuresText", label: "Panels Text", multiline: true },
    { key: "howEyebrow", label: "How It Works Eyebrow" },
    { key: "howTitle", label: "How It Works Title" },
    { key: "howText", label: "How It Works Text", multiline: true },
    { key: "benefitsEyebrow", label: "Benefits Eyebrow" },
    { key: "benefitsTitle", label: "Benefits Title" },
    { key: "benefitsText", label: "Benefits Text", multiline: true },
    { key: "faqEyebrow", label: "FAQ Eyebrow" },
    { key: "faqTitle", label: "FAQ Title" },
    { key: "faqText", label: "FAQ Text", multiline: true },
    { key: "finalCtaEyebrow", label: "Final CTA Eyebrow" },
    { key: "finalCtaTitle", label: "Final CTA Title" },
    { key: "finalCtaText", label: "Final CTA Text", multiline: true },
    { key: "supportEyebrow", label: "Support Eyebrow" },
    { key: "supportTitle", label: "Support Title" },
    { key: "supportText", label: "Support Text", multiline: true },
    { key: "communityEyebrow", label: "Community Eyebrow" },
    { key: "communityTitle", label: "Community Title" },
    { key: "communityText", label: "Community Text", multiline: true },
    { key: "contactEyebrow", label: "Order Section Eyebrow" },
    { key: "contactTitle", label: "Order Section Title" },
    { key: "contactText", label: "Order Section Text", multiline: true },
    { key: "newsletterTitle", label: "Newsletter Title" },
    { key: "newsletterText", label: "Newsletter Text", multiline: true }
  ];

  async function save() {
    await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    await reload();
  }
  return (
    <div className="grid gap-5">
      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Website Copy Manager</h3>
        <p className="mt-2 text-[#aeb8df]">Edit every major public section without touching code.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {textFields.map((field) => {
            const value = String(draft[field.key] ?? "");
            return field.multiline ? (
              <label key={String(field.key)} className="grid gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#aeb8df] md:col-span-2">
                {field.label}
                <textarea value={value} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} className="admin-input min-h-24" />
              </label>
            ) : (
              <label key={String(field.key)} className="grid gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#aeb8df]">
                {field.label}
                <input value={value} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} className="admin-input" />
              </label>
            );
          })}
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Live Store Stats</h3>
        <div className="mt-5 grid gap-3">
          {draft.stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input value={stat.value} onChange={(event) => setDraft({ ...draft, stats: draft.stats.map((item, i) => i === index ? { ...item, value: event.target.value } : item) })} className="admin-input" placeholder="Value" />
              <input value={stat.label} onChange={(event) => setDraft({ ...draft, stats: draft.stats.map((item, i) => i === index ? { ...item, label: event.target.value } : item) })} className="admin-input" placeholder="Label" />
              <button onClick={() => setDraft({ ...draft, stats: draft.stats.filter((_, i) => i !== index) })} className="rounded-md border border-red-300/30 px-4 text-red-100">Remove</button>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => setDraft({ ...draft, stats: [...draft.stats, { value: "", label: "" }] })} className="rounded-md border border-white/15 px-5 py-3 font-bold uppercase">Add Stat</button>
          <button onClick={save} className="inline-flex items-center gap-2 rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase"><Save size={18} /> Save Content</button>
        </div>
      </AdminCard>
    </div>
  );
}

function SettingsPanel({ store, reload }: { store: AdminStore; reload: () => Promise<void> }) {
  const [draft, setDraft] = useState(store.settings);
  const groups = [
    {
      title: "Brand",
      fields: [
        ["websiteName", "Website Name"],
        ["brandName", "Navbar Brand Name"],
        ["brandTagline", "Navbar Tagline"],
        ["logoUrl", "Logo URL"],
        ["orderButtonText", "Order Button Text"]
      ]
    },
    {
      title: "Support And Forms",
      fields: [
        ["supportEmail", "Support Email"],
        ["formSubmitEmail", "FormSubmit Email"],
        ["whatsappNumber", "WhatsApp Number"],
        ["whatsappUrl", "WhatsApp URL"]
      ]
    },
    {
      title: "Community",
      fields: [
        ["youtubeLink", "YouTube Link"],
        ["youtubeDescription", "YouTube Description"],
        ["discordLink", "Discord Link"],
        ["discordDescription", "Discord Description"]
      ]
    },
    {
      title: "Footer And Theme",
      fields: [
        ["footerDescription", "Footer Description"],
        ["copyrightText", "Copyright Text"],
        ["primaryColor", "Primary Color"],
        ["secondaryColor", "Secondary Color"]
      ]
    }
  ] as const;

  async function save() {
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    await reload();
  }
  return (
    <div className="grid gap-5">
      {groups.map((group) => (
        <AdminCard key={group.title}>
          <h3 className="text-2xl font-bold uppercase">{group.title}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {group.fields.map(([key, label]) => (
              <label key={key} className={`grid gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#aeb8df] ${key.includes("Description") || key === "footerDescription" ? "md:col-span-2" : ""}`}>
                {label}
                {key.includes("Description") || key === "footerDescription" ? (
                  <textarea value={String(draft[key] ?? "")} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} className="admin-input min-h-24" />
                ) : (
                  <input value={String(draft[key] ?? "")} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} className="admin-input" />
                )}
              </label>
            ))}
          </div>
        </AdminCard>
      ))}
      <button onClick={save} className="inline-flex w-fit items-center gap-2 rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase"><Save size={18} /> Save Settings</button>
    </div>
  );
}

function AuthSettingsPanel({ store, reload }: { store: AdminStore; reload: () => Promise<void> }) {
  const [draft, setDraft] = useState({
    username: store.adminUser.username,
    password: "",
    recoveryEmail: store.adminUser.recoveryEmail,
    backupRecoveryEmail: store.adminUser.backupRecoveryEmail,
    whatsappNumber: store.adminUser.whatsappNumber,
    sessionTimeoutMinutes: store.adminUser.sessionTimeoutMinutes
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/auth-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    if (!response.ok) {
      setError((await response.json().catch(() => ({}))).error || "Could not update authentication settings.");
      return;
    }
    setMessage(draft.password ? "Authentication updated. Password changes log out active sessions." : "Authentication settings updated.");
    setDraft({ ...draft, password: "" });
    await reload();
  }

  async function revokeSessions() {
    await fetch("/api/admin/auth-settings", { method: "DELETE" });
    setMessage("All active sessions revoked.");
    await reload();
  }

  async function updateRecovery(id: string, status: "approved" | "rejected") {
    await fetch("/api/admin/recovery/whatsapp", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    await reload();
  }

  return (
    <div className="grid gap-5">
      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Owner Authentication</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} className="admin-input" placeholder="Admin Username" />
          <input value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} className="admin-input" placeholder="New Password (leave blank to keep current)" type="password" />
          <input value={draft.recoveryEmail} onChange={(event) => setDraft({ ...draft, recoveryEmail: event.target.value })} className="admin-input" placeholder="Recovery Email" />
          <input value={draft.backupRecoveryEmail} onChange={(event) => setDraft({ ...draft, backupRecoveryEmail: event.target.value })} className="admin-input" placeholder="Backup Recovery Email" />
          <input value={draft.whatsappNumber} onChange={(event) => setDraft({ ...draft, whatsappNumber: event.target.value })} className="admin-input" placeholder="WhatsApp Recovery Number" />
          <input value={draft.sessionTimeoutMinutes} onChange={(event) => setDraft({ ...draft, sessionTimeoutMinutes: Number(event.target.value) })} className="admin-input" placeholder="Session Timeout Minutes" type="number" min={15} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={save} className="rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase">Save Auth Settings</button>
          <button onClick={revokeSessions} className="rounded-md border border-red-300/30 px-5 py-3 font-bold uppercase text-red-100">Logout From All Devices</button>
        </div>
        {message ? <p className="mt-4 rounded-md border border-emerald-300/30 bg-emerald-400/12 p-3 text-emerald-100">{message}</p> : null}
        {error ? <p className="mt-4 rounded-md border border-red-300/30 bg-red-500/12 p-3 text-red-100">{error}</p> : null}
      </AdminCard>

      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Login History</h3>
        <div className="mt-4 max-h-80 overflow-auto">
          {store.loginHistory.map((item) => (
            <div key={item.id} className="grid gap-2 border-t border-white/10 py-3 text-sm md:grid-cols-5">
              <span>{new Date(item.createdAt).toLocaleString()}</span>
              <span>{item.username}</span>
              <span className={item.success ? "text-emerald-200" : "text-red-200"}>{item.success ? "Success" : "Failed"}</span>
              <span>{item.ip}</span>
              <span className="truncate text-[#aeb8df]">{item.userAgent}</span>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">Active Sessions</h3>
        <div className="mt-4 grid gap-3">
          {store.activeSessions.map((session) => (
            <div key={session.id} className="rounded-md border border-white/10 bg-white/7 p-3 text-sm">
              <p className="font-bold">{session.revoked ? "Revoked" : "Active"} | Expires {new Date(session.expiresAt).toLocaleString()}</p>
              <p className="mt-1 text-[#aeb8df]">{session.ip} | {session.userAgent}</p>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="text-2xl font-bold uppercase">WhatsApp Recovery Requests</h3>
        <div className="mt-4 grid gap-3">
          {store.recoveryRequests.map((request) => (
            <div key={request.id} className="grid gap-3 rounded-md border border-white/10 bg-white/7 p-3 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-bold">{request.username} | {request.status}</p>
                <p className="text-sm text-[#aeb8df]">{request.id} | {new Date(request.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateRecovery(request.id, "approved")} className="rounded-md border border-emerald-300/30 px-3 py-2 text-emerald-100">Approve</button>
                <button onClick={() => updateRecovery(request.id, "rejected")} className="rounded-md border border-red-300/30 px-3 py-2 text-red-100">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function ListEditor<T extends { id: string; enabled?: boolean }>({ title, items, setItems, save, fields, newItem }: { title: string; items: T[]; setItems: (items: T[]) => void; save: () => Promise<void>; fields: Array<keyof T>; newItem: T }) {
  return (
    <AdminCard>
      <h3 className="text-2xl font-bold uppercase">{title}</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item, index) => <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">{fields.map((field) => <input key={String(field)} value={String(item[field] ?? "")} onChange={(e) => setItems(items.map((candidate, i) => i === index ? { ...candidate, [field]: e.target.value } : candidate))} className="admin-input" placeholder={String(field)} />)}<button onClick={() => setItems(items.filter((_, i) => i !== index))} className="rounded-md border border-red-300/30 px-4 text-red-100"><Trash2 size={18} /></button></div>)}
      </div>
      <div className="mt-5 flex gap-3"><button onClick={() => setItems([...items, { ...newItem, id: crypto.randomUUID() }])} className="rounded-md border border-white/15 px-5 py-3 font-bold uppercase">Add</button><button onClick={save} className="rounded-md bg-[#4382DF] px-5 py-3 font-bold uppercase">Save</button></div>
    </AdminCard>
  );
}

function DeleteButton({ url, reload, label = "Delete" }: { url: string; reload: () => Promise<void>; label?: string }) {
  return <button onClick={async () => { await fetch(url, { method: "DELETE" }); await reload(); }} className="inline-flex items-center gap-2 rounded-md border border-red-300/30 px-3 py-2 text-red-100"><Trash2 size={16} /> {label}</button>;
}
