import { forwardRef } from "react";
import { BedDouble, Globe, MapPin, Mountain, Phone, Trees, UtensilsCrossed } from "lucide-react";
import { AssetImage } from "@/components/AssetImage";
import { Botanical } from "@/components/Botanical";
import { ResortLogo } from "@/components/ResortLogo";
import { AmenityItem } from "@/components/AmenityItem";
import type { VoucherData } from "@/types/voucher";

export const VoucherBack = forwardRef<HTMLElement, { data: VoucherData }>(function VoucherBack(
  { data },
  ref,
) {
  return (
    <article
      ref={ref}
      className="voucher-card voucher-back"
      aria-label="Back of complimentary stay voucher"
    >
      <div className="back-hero">
        <AssetImage
          src={data.heroImage}
          alt="Upavan Resort surrounded by the natural beauty of Wayanad"
        />
        <div className="back-hero-shade" />
        <span className="hero-destination">
          A QUIETER KIND OF ESCAPE
          <br />
          <span>WAYANAD, KERALA</span>
        </span>
        <h2>
          <span>EXPERIENCE</span>WAYANAD<em>DIFFERENTLY</em>
        </h2>
      </div>
      <div className="back-body">
        <p className="experience-line">
          STAY <span>•</span> UNWIND <span>•</span> RECONNECT
        </p>
        <div className="photo-gallery">
          {[
            {
              src: data.galleryImage1,
              label: "Rest beautifully",
              alt: "A comfortable room at Upavan Resort",
            },
            {
              src: data.galleryImage2,
              label: "Savour the moment",
              alt: "The restaurant and resort experience",
            },
            {
              src: data.galleryImage3,
              label: "Find your stillness",
              alt: "Lush greenery and Wayanad views",
            },
          ].map((photo) => (
            <figure key={photo.label}>
              <AssetImage src={photo.src} alt={photo.alt} />
              <figcaption>{photo.label}</figcaption>
            </figure>
          ))}
        </div>
        <div className="amenities">
          <AmenityItem icon={BedDouble} label="Comfortable Stays" />
          <AmenityItem icon={UtensilsCrossed} label="Delicious Cuisine" />
          <AmenityItem icon={Trees} label="Nature Experiences" />
          <AmenityItem icon={Mountain} label="Breathtaking Views" />
        </div>
        <footer className="back-footer">
          <ResortLogo src={data.logo} className="back-logo" />
          <address className="resort-contact">
            <p>
              <MapPin size={12} aria-hidden="true" />
              Lakkidi P.O., Wayanad, Kerala - 673576
            </p>
            <p>
              <Phone size={12} aria-hidden="true" />
              <a href="tel:04936255272">04936 255 272</a>
            </p>
            <p>
              <Globe size={12} aria-hidden="true" />
              <a href="https://www.upavanresort.com" target="_blank" rel="noreferrer">
                www.upavanresort.com
              </a>
            </p>
          </address>
          <p className="nature-phrase">
            WHERE
            <br />
            NATURE
            <br />
            <em>FEELS LIKE HOME</em>
          </p>
        </footer>
      </div>
      <Botanical className="back-botanical-left" />
      <Botanical className="back-botanical-right" />
      <div className="voucher-border" />
    </article>
  );
});
