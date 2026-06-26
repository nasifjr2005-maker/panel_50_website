import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Gamepad2, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import { panelCategories, panelPricing } from "@/lib/data";
import type { PanelPrice, SelectedPanelOrder } from "@/lib/data";

export function Features({
  selectedOrder,
  onOrderSelect,
  content = {}
}: {
  selectedOrder: SelectedPanelOrder | null;
  onOrderSelect: (order: SelectedPanelOrder) => void;
  content?: Record<string, string>;
}) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<PanelPrice | null>(null);
  const [managedCategories, setManagedCategories] = useState(panelCategories);
  const [managedPricing, setManagedPricing] = useState<Record<string, PanelPrice[]>>(panelPricing);
  const [managedMedia, setManagedMedia] = useState<Record<string, Array<{ url: string; type: string; name: string; isFeatured: boolean }>>>({});
  const activePrices = activePanel ? managedPricing[activePanel] ?? [] : [];
  const activeMedia = activePanel ? managedMedia[activePanel] ?? [] : [];
  const activeLogo = activeMedia.find((item) => item.type === "image" && item.isFeatured) ?? activeMedia.find((item) => item.type === "image");
  const highestPrice = activePrices.reduce((max, price) => Math.max(max, price.bdt), 0);

  function openPricing(panel: string) {
    const prices = managedPricing[panel] ?? [];
    setActivePanel(panel);
    setSelectedPrice(prices[0] ?? null);
  }

  function closePricing() {
    setActivePanel(null);
    setSelectedPrice(null);
  }

  function handleOrderNow() {
    if (!activePanel || !selectedPrice) {
      return;
    }

    onOrderSelect({ panel: activePanel, ...selectedPrice });
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
    async function loadManagedProducts() {
      try {
        const response = await fetch("/api/store/products", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setManagedCategories(data.categories ?? panelCategories);
        setManagedPricing(data.pricing ?? panelPricing);
        setManagedMedia(data.media ?? {});
      } catch {
        setManagedCategories(panelCategories);
        setManagedPricing(panelPricing);
      }
    }

    void loadManagedProducts();
  }, []);

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
                    {category.panels.length} options
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {category.panels.map((panel) => {
                    const isSelected = selectedOrder?.panel === panel;
                    const panelMedia = managedMedia[panel] ?? [];
                    const panelLogo = panelMedia.find((item) => item.type === "image" && item.isFeatured) ?? panelMedia.find((item) => item.type === "image");

                    return (
                      <button
                        key={panel}
                        type="button"
                        onClick={() => openPricing(panel)}
                        aria-pressed={isSelected}
                        className={`premium-shine group relative min-h-32 rounded-lg border p-5 text-left transition duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#7cb0ff] hover:bg-[#4382DF]/14 hover:shadow-[0_22px_70px_rgba(67,130,223,0.2)] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f] ${
                          isSelected
                            ? "border-[#7cb0ff] bg-[#4382DF]/22 shadow-[0_0_35px_rgba(67,130,223,0.3)]"
                            : "border-white/12 bg-[#090b24]/72"
                        }`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className={`flex size-11 shrink-0 items-center justify-center rounded-md transition ${isSelected ? "bg-[#4382DF] text-white" : "bg-[#4382DF]/18 text-[#7cb0ff] group-hover:bg-[#4382DF] group-hover:text-white"}`}>
                            {panelLogo ? (
                              <img src={panelLogo.url} alt="" className="h-full w-full rounded-md object-cover" />
                            ) : isSelected ? <Check size={22} aria-hidden="true" /> : <Gamepad2 size={22} aria-hidden="true" />}
                          </span>
                          {isSelected ? (
                            <span className="rounded-md border border-emerald-300/35 bg-emerald-400/15 px-2.5 py-1 text-xs font-bold uppercase text-emerald-100">
                              Selected
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-5 block text-xl font-bold uppercase leading-tight text-white">{panel}</span>
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
        {activePanel ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#020412]/82 px-3 py-4 backdrop-blur-md sm:items-center sm:px-4 sm:py-6"
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
            className="glass relative max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg p-4 shadow-[0_0_90px_rgba(67,130,223,0.32)] sm:max-h-[calc(100dvh-3rem)] sm:p-6"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 flex items-start justify-between gap-4 border-b border-white/10 bg-[#090b24]/95 p-4 backdrop-blur-xl sm:-mx-6 sm:-mt-6 sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                {activeLogo ? <img src={activeLogo.url} alt="" className="size-12 shrink-0 rounded-md border border-white/12 object-cover" /> : null}
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cb0ff]">Pricing</p>
                  <h3 id="panel-pricing-title" className="mt-1 text-2xl font-bold uppercase leading-tight text-white sm:text-3xl">
                    {activePanel} Pricing
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

            {activePrices.length > 0 ? (
              <>
                {activeMedia.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {activeMedia.slice(0, 4).map((item) => (
                      <div key={item.url} className="overflow-hidden rounded-lg border border-white/12 bg-white/7">
                        {item.type === "video" ? (
                          <video src={item.url} controls className="aspect-video w-full bg-black" />
                        ) : (
                          <img src={item.url} alt={item.name} className="aspect-video w-full object-cover" />
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
          </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
