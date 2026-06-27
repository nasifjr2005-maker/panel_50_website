import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Gamepad2, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import { panelCategories, panelPricing } from "@/lib/data";
import type { StoreCatalog, StoreCategory, StoreProduct } from "@/lib/storefront-types";
import type { PanelPrice, SelectedPanelOrder } from "@/lib/data";

type StoreMedia = {
  id?: string;
  url: string;
  type: string;
  name: string;
  isFeatured: boolean;
};

const fallbackCategories: StoreCategory[] = panelCategories.map((category, categoryIndex) => ({
  ...category,
  id: `fallback-category-${categoryIndex}`,
  name: category.category,
  products: category.panels.map((panel) => ({
    id: panel,
    name: panel,
    categoryId: `fallback-category-${categoryIndex}`,
    categoryName: category.category
  }))
}));

function getCategoryProducts(category: StoreCategory): StoreProduct[] {
  if (category.products?.length) {
    return category.products;
  }

  return (category.panels ?? []).map((panel) => ({
    id: panel,
    name: panel,
    categoryId: category.id,
    categoryName: category.category
  }));
}

function findFeaturedImage(items: StoreMedia[]) {
  return items.find((item) => item.type === "image" && item.isFeatured) ?? items.find((item) => item.type === "image");
}

function getProductLogo(product: StoreProduct, logos: StoreCatalog["logos"]) {
  return product.logo ?? logos[product.id] ?? logos[product.name] ?? null;
}

export function Features({
  selectedOrder,
  onOrderSelect,
  content = {},
  catalog
}: {
  selectedOrder: SelectedPanelOrder | null;
  onOrderSelect: (order: SelectedPanelOrder) => void;
  content?: Record<string, string>;
  catalog?: StoreCatalog;
}) {
  const [activeProduct, setActiveProduct] = useState<StoreProduct | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<PanelPrice | null>(null);
  const [managedMedia, setManagedMedia] = useState<Record<string, StoreMedia[]>>({});
  const [mediaLoading, setMediaLoading] = useState(false);
  const managedCategories = catalog?.categories?.length ? catalog.categories : fallbackCategories;
  const managedPricing = useMemo(
    () => Object.keys(catalog?.pricing ?? {}).length ? catalog?.pricing ?? panelPricing : panelPricing,
    [catalog?.pricing]
  );
  const managedLogos = useMemo(() => catalog?.logos ?? {}, [catalog?.logos]);
  const activePrices = activeProduct ? managedPricing[activeProduct.id] ?? managedPricing[activeProduct.name] ?? [] : [];
  const activeMedia = activeProduct ? managedMedia[activeProduct.id] ?? managedMedia[activeProduct.name] ?? [] : [];
  const activeLogo = activeProduct ? getProductLogo(activeProduct, managedLogos) ?? findFeaturedImage(activeMedia) : null;
  const highestPrice = activePrices.reduce((max, price) => Math.max(max, price.bdt), 0);

  function openPricing(product: StoreProduct) {
    const prices = managedPricing[product.id] ?? managedPricing[product.name] ?? [];
    setActiveProduct(product);
    setSelectedPrice(prices[0] ?? null);
  }

  function closePricing() {
    setActiveProduct(null);
    setSelectedPrice(null);
  }

  function handleOrderNow() {
    if (!activeProduct || !selectedPrice) {
      return;
    }

    onOrderSelect({ productId: activeProduct.id, panel: activeProduct.name, ...selectedPrice });
    closePricing();
  }

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePricing();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [activeProduct]);

  useEffect(() => {
    if (!activeProduct || activeMedia.length) {
      return;
    }

    let cancelled = false;
    async function loadProductMedia(product: StoreProduct) {
      setMediaLoading(true);
      try {
        const response = await fetch(`/api/store/products/${encodeURIComponent(product.id)}/media`, { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!cancelled) {
          const media = data.media ?? [];
          setManagedMedia((current) => ({ ...current, [product.id]: media, [product.name]: media }));
        }
      } catch {
        // The logo and pricing stay usable if the optional gallery fails.
      } finally {
        if (!cancelled) {
          setMediaLoading(false);
        }
      }
    }

    void loadProductMedia(activeProduct);
    return () => {
      cancelled = true;
    };
  }, [activeMedia.length, activeProduct]);

  return (
    <section id="features" className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.featuresEyebrow || "Panel selection"}
            title={content.featuresTitle || "Choose your panel"}
            text={content.featuresText || "Pick the product that matches your device and setup. Your selection stays active and is sent directly into the order section."}
          />
        </Reveal>

        <div id="pricing" className="mt-12 grid gap-8">
          {managedCategories.map((category, categoryIndex) => (
            <Reveal key={category.category} delay={categoryIndex * 0.05}>
              <section className="glass rounded-lg p-5 sm:p-6">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cb0ff]">
                      Category {categoryIndex + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold uppercase text-white sm:text-3xl">{category.category}</h3>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-[#c8d1f3]">{category.description}</p>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-md border border-[#4382DF]/35 bg-[#4382DF]/12 px-3 py-2 text-sm font-bold uppercase text-[#bcd5ff]">
                    {getCategoryProducts(category).length} options
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {getCategoryProducts(category).map((product) => {
                    const isSelected = selectedOrder?.productId === product.id || selectedOrder?.panel === product.name;
                    const panelLogo = getProductLogo(product, managedLogos);

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => openPricing(product)}
                        aria-pressed={isSelected}
                        className={`premium-shine group relative flex min-h-36 flex-col rounded-lg border p-4 text-left transition duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#7cb0ff] hover:bg-[#4382DF]/14 hover:shadow-[0_22px_70px_rgba(67,130,223,0.2)] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f] sm:p-5 ${
                          isSelected
                            ? "border-[#7cb0ff] bg-[#4382DF]/22 shadow-[0_0_35px_rgba(67,130,223,0.3)]"
                            : "border-white/12 bg-[#090b24]/72"
                        }`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className={`flex size-14 shrink-0 items-center justify-center rounded-md border border-white/10 p-1.5 transition ${isSelected ? "bg-[#4382DF] text-white" : "bg-[#4382DF]/18 text-[#7cb0ff] group-hover:bg-[#4382DF] group-hover:text-white"}`}>
                            {panelLogo ? (
                              <img src={panelLogo.url} alt="" className="h-full w-full rounded-sm object-contain" />
                            ) : isSelected ? <Check size={22} aria-hidden="true" /> : <Gamepad2 size={22} aria-hidden="true" />}
                          </span>
                          {isSelected ? (
                            <span className="rounded-md border border-emerald-300/35 bg-emerald-400/15 px-2.5 py-1 text-xs font-bold uppercase text-emerald-100">
                              Selected
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-5 block break-words text-lg font-bold uppercase leading-tight text-white sm:text-xl">{product.name}</span>
                        {product.description ? (
                          <span className="mt-2 line-clamp-2 text-sm leading-5 text-[#aeb8df]">{product.description}</span>
                        ) : null}
                        <span className="mt-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[#9dbef5]">
                          Tap to order
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {activeProduct ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[#020412]/82 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-pricing-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closePricing();
              }
            }}
          >
          <motion.div
            className="glass relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-lg shadow-[0_0_90px_rgba(67,130,223,0.32)] sm:max-h-[calc(100dvh-3rem)]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-[#090b24]/95 p-4 backdrop-blur-xl sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                {activeLogo ? (
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/8 p-2">
                    <img src={activeLogo.url} alt="" className="h-full w-full rounded-sm object-contain" />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cb0ff]">Pricing</p>
                  <h3 id="panel-pricing-title" className="mt-1 break-words text-xl font-bold uppercase leading-tight text-white sm:text-3xl">
                    {activeProduct.name} Pricing
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={closePricing}
                className="flex size-11 shrink-0 items-center justify-center rounded-md border border-white/20 bg-[#4382DF] text-white shadow-[0_0_24px_rgba(67,130,223,0.35)] transition hover:border-[#7cb0ff] hover:bg-[#5a95f0] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f]"
                aria-label="Close pricing modal"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            {activePrices.length > 0 ? (
              <>
                {mediaLoading && !activeMedia.length ? (
                  <div className="mt-5 rounded-lg border border-white/12 bg-white/7 p-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#aeb8df]">
                    Loading media...
                  </div>
                ) : null}
                {activeMedia.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {activeMedia.slice(0, 4).map((item) => (
                      <div key={item.url} className="overflow-hidden rounded-lg border border-white/12 bg-white/7">
                        {item.type === "video" ? (
                          <video src={item.url} controls className="aspect-video w-full bg-black" />
                        ) : (
                          <img src={item.url} alt={item.name} className="aspect-video w-full object-contain p-2" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-5 grid gap-3">
                  {activePrices.map((price) => {
                    const isPriceSelected = selectedPrice?.duration === price.duration;
                    const isBestValue = price.bdt === highestPrice;

                    return (
                      <button
                        key={price.duration}
                        type="button"
                        onClick={() => setSelectedPrice(price)}
                        className={`premium-shine flex items-center justify-between gap-4 rounded-lg border p-4 text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f] ${
                          isPriceSelected
                            ? "border-[#7cb0ff] bg-[#4382DF]/18 shadow-[0_0_32px_rgba(67,130,223,0.2)]"
                            : isBestValue
                              ? "border-amber-300/35 bg-amber-300/10 hover:border-amber-200/70"
                              : "border-white/12 bg-white/7 hover:border-[#7cb0ff]/55"
                        }`}
                        aria-pressed={isPriceSelected}
                      >
                        <span>
                          <span className="flex items-center gap-2 text-xl font-bold uppercase text-white">
                            {price.duration}
                            {isBestValue ? (
                              <span className="rounded-md border border-amber-200/40 bg-amber-300/15 px-2 py-1 text-xs text-amber-100">
                                Best Value
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.12em] text-[#9dbef5]">
                            Select duration
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="block text-xl font-bold text-white">{price.bdt} BDT</span>
                          <span className="block text-sm font-semibold text-[#c8d1f3]">{price.usd}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-lg border border-white/12 bg-white/7 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#aeb8df]">Selected package</p>
                  <p className="mt-1 text-2xl font-bold uppercase text-white">
                    {selectedPrice?.duration} - {selectedPrice?.bdt} BDT ({selectedPrice?.usd})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOrderNow}
                  disabled={!selectedPrice}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#4382DF] px-6 text-base font-bold uppercase text-white shadow-[0_0_30px_rgba(67,130,223,0.45)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#5a95f0] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f] disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-[#7f89b4] disabled:shadow-none"
                >
                  Order Now
                </button>
              </>
            ) : (
              <div className="mt-5 rounded-lg border border-amber-300/30 bg-amber-300/10 p-5">
                <p className="text-lg font-bold uppercase text-white">Pricing is being confirmed for this panel.</p>
                <p className="mt-2 text-base leading-7 text-amber-100/90">
                  Please choose another listed package or contact support for current pricing.
                </p>
              </div>
            )}
            </div>
          </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
