'use client';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import type { PromoBanner } from '@chased/shared';
import { useRef } from 'react';

export function PromoCarousel({ promos }: { promos: PromoBanner[] }) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  return (
    <div className="overflow-hidden rounded-3xl shadow-card" ref={emblaRef}>
      <div className="flex">
        {promos.map(promo => {
          const href = promo.link_type === 'category' && promo.link_target_id
            ? `/category/${promo.link_target_id}`
            : promo.link_type === 'product' && promo.link_target_id
            ? `/product/${promo.link_target_id}` : '#';
          return (
            <div key={promo.id} className="flex-[0_0_100%] min-w-0">
              <Link href={href} className="block relative h-44 bg-slate-100">
                <Image src={promo.image_url} alt={promo.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg leading-tight drop-shadow">{promo.title}</h3>
                  {promo.subtitle && <p className="text-white/80 text-sm mt-0.5 drop-shadow">{promo.subtitle}</p>}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
