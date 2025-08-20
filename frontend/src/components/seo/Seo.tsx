import React from "react";
import Head from "next/head";

const Seo: React.FC = () => (
  <>
    <title>MSMEBazaar - Empowering Indian MSMEs</title>
    <meta
      name="description"
      content="India's leading platform for Micro, Small & Medium Enterprises. Connect, grow, and scale your business with MSMEBazaar."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://msmebazaar.com/" />
    <meta property="og:title" content="MSMEBazaar - Empowering Indian MSMEs" />
    <meta
      property="og:description"
      content="India's leading platform for Micro, Small & Medium Enterprises. Connect, grow, and scale your business with MSMEBazaar."
    />
    <meta property="og:image" content="/og-image.jpg" />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://msmebazaar.com/" />
    <meta property="twitter:title" content="MSMEBazaar - Empowering Indian MSMEs" />
    <meta
      property="twitter:description"
      content="India's leading platform for Micro, Small & Medium Enterprises. Connect, grow, and scale your business with MSMEBazaar."
    />
    <meta property="twitter:image" content="/og-image.jpg" />

    {/* Additional SEO */}
    <meta
      name="keywords"
      content="MSME, Small Business, Indian Business, B2B Marketplace, Business Loans, GST, Udyam Registration"
    />
    <meta name="author" content="MSMEBazaar" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://msmebazaar.com/" />

    {/* Preconnect to external domains for fonts */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

    {/* Google Fonts */}
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </>
);

export default Seo;
