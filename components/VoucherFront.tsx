import { forwardRef } from "react";
import { BedDouble, MapPin } from "lucide-react";
import { Botanical } from "@/components/Botanical";
import { ResortLogo } from "@/components/ResortLogo";
import { ResortSeal } from "@/components/ResortSeal";
import { AssetImage } from "@/components/AssetImage";
import { FitText } from "@/components/FitText";
import { punctuateName } from "@/lib/defaults";
import type { VoucherData } from "@/types/voucher";

export const VoucherFront = forwardRef<HTMLElement, { data: VoucherData; includeMessage: boolean }>(
  function VoucherFront({ data, includeMessage }, ref) {
    const guestSize = data.coupleName.length > 55 ? 24 : data.coupleName.length > 35 ? 28 : 33;
    const sponsorSize = data.sponsorName.length > 55 ? 23 : data.sponsorName.length > 35 ? 28 : 34;
    return (
      <article
        ref={ref}
        className={`voucher-card voucher-front ${includeMessage ? "with-message" : ""}`}
        aria-label="Front of complimentary stay voucher"
      >
        <div className="front-photo">
          <AssetImage
            src={data.mainRoomImage}
            alt="A welcoming room at Upavan Resort, opening onto Wayanad greenery"
          />
          <div className="photo-caption">
            <span>MORE THAN A STAY</span>
            <em>A feeling.</em>
          </div>
        </div>
        <svg className="front-gold-curve" viewBox="0 0 900 600" aria-hidden="true">
          <path
            d="M740 -30C370 45 563 323 456 477"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1"
            opacity=".65"
          />
        </svg>
        <Botanical className="front-botanical" />
        <div className="front-content">
          <ResortLogo src={data.logo} className="front-logo" />
          <p className="front-tagline">NATURE RESTS HERE WITH YOU</p>
          <div className="title-rule">
            <span />
            <i />
          </div>
          <h2 className="voucher-title">
            Complimentary
            <br />
            <span>Stay Voucher</span>
          </h2>
          <div className="stay-duration">
            <BedDouble size={25} strokeWidth={1.3} aria-hidden="true" />
            <span>
              1 Day <i>•</i> 1 Night
            </span>
          </div>
          <div className="guest-banner">
            <span className="guest-for">Especially for</span>
            <FitText
              text={data.coupleName.trim() || "Your guests"}
              className="guest-name"
              maxSize={guestSize}
              height={46}
            />
          </div>
          <div className="front-location">
            <MapPin size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>Wayanad, Kerala</span>
          </div>
          <p className="weekday-condition">
            Weekday Stay <span>|</span> Not valid on Saturdays &amp; Sundays
          </p>
        </div>
        <footer className="front-regards">
          <div className="regards-copy">
            {includeMessage ? (
              <div className="voucher-invitation">
                <FitText
                  text={`Dear ${data.coupleName.trim() || "our guests"},`}
                  className="invitation-dear"
                  maxSize={15}
                  minSize={10}
                  height={26}
                />
                <p>
                  We invite you to stay at Upavan Resort, Wayanad for a day and a night at your
                  convenience, except on Saturdays and Sundays. Please let us know the date of your
                  convenience.
                </p>
              </div>
            ) : (
              <span className="regards-topline">
                A little time away. A beautiful memory together.
              </span>
            )}
            <p className="regards-label">With warm regards and best wishes,</p>
            <FitText
              text={punctuateName(data.sponsorName) || "Your hosts."}
              className="sponsor-name"
              maxSize={sponsorSize}
              height={42}
            />
          </div>
          <ResortSeal src={data.seal} />
          <Botanical className="regards-botanical" />
        </footer>
        <div className="voucher-border" />
      </article>
    );
  },
);
