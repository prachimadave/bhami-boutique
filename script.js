/**
 * BHAMI CRAFT BOUTIQUE - SCRIPT.JS
 * Vanilla JavaScript (No frameworks / No backend)
 * Features:
 * - 24 Rich Authentic Maharashtrian Craft Products across 8 Categories
 * - LocalStorage Persistent Shopping Cart & Wishlist
 * - Dynamic Category Filtering, Realtime Search & Multi-criteria Sorting
 * - Product Details Modal (Quick View) with specs & custom variation trigger
 * - Interactive Custom Order Form with Live Specimen Preview
 * - Demo Checkout Modal with Simulated Order Receipt
 * - Accessible Drawer Navigation, FAQ Accordion, and Toast System
 */

'use strict';

// ==========================================================================
// 1. SAMPLE PRODUCT DATA (24 Items across the 8 required categories)
// ==========================================================================

const PRODUCTS_DATA = [
  // --- Category 1: Mundavalya ---
  {
    id: 'mun-01',
    name: 'Classic Basra Pearl & Gold Chain Bridal Mundavalya',
    marathiName: 'पारंपरिक नाजूक मोती व सुवर्ण साखळी मुंडावळ्या',
    category: 'Mundavalya',
    price: 999,
    mrp: 1299,
    rating: 5.0,
    reviewsCount: 74,
    badge: 'Bestseller',
    image: 'images/bhami-pearl-chain-mundavalya.jpg',
    description: 'Exquisite handcrafted bridal mundavalya designed with fine gold chain links, delicate Basra pearls, cascading side pearl clusters, and faceted ruby-maroon crystal drops. Back tie features an adjustable golden cord with royal red tassel.',
    materials: '22K gold-polished brass chain, hand-threaded Basra imitation pearls, faceted maroon crystal teardrops, red silk tassel.',
    dimensions: 'Forehead chain: 13.5 inches | Cascading drops: 8.5 inches | Adjustable golden cord.',
    inStock: true
  },
  {
    id: 'mun-02',
    name: 'Royal Emerald Kundan & Pearl Mundavalya Pair',
    marathiName: 'शाही पाचू कुंदन व मोती मुंडावळ्या जोडी',
    category: 'Mundavalya',
    price: 1299,
    mrp: 1650,
    rating: 4.9,
    reviewsCount: 52,
    badge: 'Handcrafted',
    image: 'images/bhami-emerald-kundan-mundavalya.jpg',
    description: 'Auspicious bride & groom mundavalya pair featuring radiant circular emerald green kundan stones encased in beaded gold florets. Flanked by double pearl strands and dangling emerald drop latkans.',
    materials: 'Emerald green kundan crystal stones, micro seed pearls, 22K gold-plated setting, golden thread dori.',
    dimensions: 'Length: 14 inches forehead chain + 9 inches side pearl ladi with adjustable cords.',
    inStock: true
  },
  {
    id: 'mun-03',
    name: 'Heritage Mukut Crown Kundan & Pearl Mundavalya',
    marathiName: 'शाही मुकुट कुंदन व मोती मुंडावळ्या',
    category: 'Mundavalya',
    price: 1450,
    mrp: 1850,
    rating: 5.0,
    reviewsCount: 63,
    badge: 'New',
    image: 'images/bhami-bridal-mundavalya.jpg',
    description: 'Grand Maharashtrian bridal forehead crown mundavalya featuring ruby-red teardrop kundan arches, pearl border crest, vibrant pink feather turra/kalgi, and twin cascading pearl strands with bright red silk tassels.',
    materials: 'Hand-embossed gold sheet, ruby kundan stones, lustrous synthetic pearls, pink feather turra, red silk pompoms.',
    dimensions: 'Mukut arch width: 7.5 inches | Cascading pearl strands: 11 inches | Adjustable tie cords.',
    inStock: true
  },

  // --- Category 2: Sakharpuda Collection ---
  {
    id: 'sakh-01',
    name: 'Mor-Pankh Velvet Sakharpuda Ring Platter',
    marathiName: 'मोरपंख मखमली साखरपुडा अंगठी ताट',
    category: 'Sakharpuda Collection',
    price: 2499,
    mrp: 3200,
    rating: 5.0,
    reviewsCount: 84,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    description: 'Grand royal engagement platter featuring rich maroon velvet, dual velvet ring holders, hand-carved brass peacock miniatures, and delicate gold gota lace border.',
    materials: 'Plywood base, premium velvet fabric, brass peacock accents, pearl border edging.',
    dimensions: 'Diameter: 12 inches circular platter.',
    inStock: true
  },
  {
    id: 'sakh-02',
    name: 'Royal Shagun Shreefal (Coconut) Golden Filigree Casing',
    marathiName: 'सुवर्ण नक्षीकाम श्रीफळ (नारळ) कव्हर',
    category: 'Sakharpuda Collection',
    price: 950,
    mrp: 1250,
    rating: 4.9,
    reviewsCount: 56,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=700&q=80',
    description: 'An auspicious embellished holder for the sacred coconut (Shreefal) gifted to the groom during Sakharpuda. Adorned with pearls, kundan florets, and red velvet lining.',
    materials: 'Gold electroplated filigree lattice, Basra pearl beads, red velvet interior.',
    dimensions: 'Fits standard coconut size: 6.5 x 4.5 inches.',
    inStock: true
  },
  {
    id: 'sakh-03',
    name: 'Bespoke Couple Name Wooden Sakharpuda Tray',
    marathiName: 'नाव कोरलेली साखरपुडा शगुन थाळी',
    category: 'Sakharpuda Collection',
    price: 1850,
    mrp: 2300,
    rating: 4.8,
    reviewsCount: 39,
    badge: 'Customisable',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=80',
    description: 'Customized wooden trousseau tray carved with bride & groom names in English or Marathi script, paired with two glass shagun containers for sugar crystals and supari.',
    materials: 'Natural engineered pine wood, 3D acrylic name lettering, satin ribbon borders.',
    dimensions: '14 x 10 inches rectangular tray.',
    inStock: true
  },

  // --- Category 3: Oti Chi Potli ---
  {
    id: 'oti-01',
    name: 'Pure Paithani Border Brocade Oti Potli (Set of 5)',
    marathiName: 'पैठणी काठ ओतीची पोटली (५ चा संच)',
    category: 'Oti Chi Potli',
    price: 1299,
    mrp: 1650,
    rating: 5.0,
    reviewsCount: 75,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=700&q=80',
    description: 'Exquisite gifting potlis tailored with authentic Yeola Paithani zari border, golden dori tassels, and auspicious coin pendants. Ideal for blessing married women during Oti ceremonies.',
    materials: 'Raw silk, authentic Paithani woven zari border, metallic gold drawstring cords.',
    dimensions: '8 x 6.5 inches per pouch.',
    inStock: true
  },
  {
    id: 'oti-02',
    name: 'Hand-Embroidered Zardozi Maroon Velvet Batwa',
    marathiName: 'झरदोझी नक्षीकाम मखमली बटवा',
    category: 'Oti Chi Potli',
    price: 499,
    mrp: 650,
    rating: 4.7,
    reviewsCount: 29,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80',
    description: 'Deep maroon velvet pouch delicately hand-stitched with floral zardozi wire and pearl beads. Perfect for packing dry fruits, supari, and shagun tokens.',
    materials: 'Micro-velvet fabric, zari metallic threads, bell latkan finish.',
    dimensions: '7.5 x 5.5 inches.',
    inStock: true
  },
  {
    id: 'oti-03',
    name: 'Traditional Haldi-Kunku Suhasini Pouches (Set of 10)',
    marathiName: 'पारंपरिक हळदी-कुंकू सुहासिनी पाऊच (१० चा संच)',
    category: 'Oti Chi Potli',
    price: 850,
    mrp: 1100,
    rating: 4.9,
    reviewsCount: 51,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80',
    description: 'Pack of 10 vibrant turmeric-yellow and maroon brocade pouches designed for festival return gifts and wedding Oti rituals.',
    materials: 'Banarasi art brocade with golden drawstring pearls.',
    dimensions: '6 x 5 inches each.',
    inStock: true
  },

  // --- Category 4: Bashing ---
  {
    id: 'bash-01',
    name: 'Traditional Solapuri Royal Groom Bashing',
    marathiName: 'पारंपरिक सोलापुरी नवरदेव बाशिंग',
    category: 'Bashing',
    price: 1450,
    mrp: 1850,
    rating: 5.0,
    reviewsCount: 47,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80',
    description: 'Authentic Solapur craftsmanship featuring the golden Sun (Surya) crest, Mor-pankh feather accent, and cascading Basra pearl strings that frame the groom’s face with pride.',
    materials: 'Reinforced craft board, gold foil embossed sheet, red velvet lining, glass pearls.',
    dimensions: 'Universal fit with adjustable satin ties.',
    inStock: true
  },
  {
    id: 'bash-02',
    name: 'Bridal Mukut Style Pearl & Kundan Bashing',
    marathiName: 'नवरीचे नाजूक मोत्यांचे बाशिंग मुकुट',
    category: 'Bashing',
    price: 1250,
    mrp: 1600,
    rating: 4.9,
    reviewsCount: 38,
    badge: 'Handcrafted',
    image: 'images/bhami-bridal-mundavalya.jpg',
    description: 'Designed specifically for the bride with a softer curved arch, ruby centerpiece brooch, and delicate golden ghungroo bells that jingle softly during Mangalashtak.',
    materials: 'Hand-cut gold sheet, synthetic pearls, micro bells, red satin cords.',
    dimensions: 'Curved arch width: 9 inches, tie length: 14 inches.',
    inStock: true
  },
  {
    id: 'bash-03',
    name: 'Heritage Chandrakor Maharashtrian Bashing Pair',
    marathiName: 'चंद्रकोर नक्षीदार वर-वधू बाशिंग जोडी',
    category: 'Bashing',
    price: 2400,
    mrp: 3000,
    rating: 4.8,
    reviewsCount: 22,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=700&q=80',
    description: 'Complete matching bride & groom pair adorned with sacred Chandrakor crescents and antique gold zari borders for a harmonious wedding portrait.',
    materials: 'Handcrafted metallic embossing, pearl garlands, velvet padding.',
    dimensions: 'Groom: 10 inches tall | Bride: 8.5 inches tall.',
    inStock: true
  },

  // --- Category 5: Baby Name Reveal Boards ---
  {
    id: 'baby-01',
    name: 'Traditional Barse Cradle Theme Name Reveal Plaque',
    marathiName: 'पारंपरिक बारसे पाळणा नाव फलक',
    category: 'Baby Name Reveal Boards',
    price: 1899,
    mrp: 2400,
    rating: 5.0,
    reviewsCount: 63,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80',
    description: 'Lovingly crafted round wooden milestone board with laser-cut cradle silhouette, floral motifs, and raised 3D golden mirror acrylic lettering for Namkaran ceremony photos.',
    materials: 'Natural Birch plywood (6mm), 3D mirror gold acrylic, easel wooden stand included.',
    dimensions: 'Diameter: 12 inches circular plaque.',
    inStock: true
  },
  {
    id: 'baby-02',
    name: 'Floral Dream Baby Girl / Boy Wooden Announcement Hoop',
    marathiName: 'फुलांच्या सजवटीचा नाव घोषणा फलक',
    category: 'Baby Name Reveal Boards',
    price: 1599,
    mrp: 1999,
    rating: 4.8,
    reviewsCount: 35,
    badge: 'Customisable',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=80',
    description: 'Embellished with preserved baby’s breath flowers, mini brass bells, and personalized birth details (weight, date, time) engraved below the newborn’s auspicious name.',
    materials: 'Solid pine wood, preserved botanicals, custom calligraphy laser engraving.',
    dimensions: 'Diameter: 10 inches.',
    inStock: true
  },
  {
    id: 'baby-03',
    name: 'Royal Velvet Embroidered Barse Keepsake Frame',
    marathiName: 'मखमली सुवर्ण नक्षीदार नामकरण फ्रेम',
    category: 'Baby Name Reveal Boards',
    price: 1350,
    mrp: 1700,
    rating: 4.9,
    reviewsCount: 28,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80',
    description: 'Textile-based name plaque featuring plush maroon or blush pink velvet hand-embroidered with golden zari threads. Makes a lasting nursery wall decor item.',
    materials: 'Wooden shadow box frame, rich velvet, gold metallic dori.',
    dimensions: '10 x 12 inches framed.',
    inStock: true
  },

  // --- Category 6: Customized Name Banners ---
  {
    id: 'ban-01',
    name: 'Shubh Vivah Wooden Welcome Entrance Banner',
    marathiName: 'शुभ विवाह लाकडी स्वागत फलक',
    category: 'Customized Name Banners',
    price: 2199,
    mrp: 2799,
    rating: 5.0,
    reviewsCount: 54,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=80',
    description: 'Stately dark walnut finished entrance board customized with couple names, wedding date, and traditional Marathi blessing "मंगलमय विवाह सोहळा" in gleaming gold acrylic.',
    materials: 'Treated moisture-resistant MDF, mirror gold acrylic font, hanging jute rope.',
    dimensions: '24 x 16 inches rectangular plaque.',
    inStock: true
  },
  {
    id: 'ban-02',
    name: 'Handcrafted Fabric Gota-Patti Festive Name Bunting',
    marathiName: 'हस्तनिर्मित गोटा-पट्टी कापडी तोरण बॅनर',
    category: 'Customized Name Banners',
    price: 1199,
    mrp: 1499,
    rating: 4.8,
    reviewsCount: 39,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=700&q=80',
    description: 'Triangular fabric flags in festive maroon, mustard yellow, and emerald green with custom hand-stitched letters and dangling pom-poms for wedding backdrop decor.',
    materials: 'Raw silk flags, gota patti lace border, golden latkan bells.',
    dimensions: 'Length: 7.5 feet with 10 customizable letter pennants.',
    inStock: true
  },
  {
    id: 'ban-03',
    name: 'Griha Pravesh Shubh-Labh Family Name Hanging Banner',
    marathiName: 'गृहप्रवेश शुभ-लाभ नाव पाटी',
    category: 'Customized Name Banners',
    price: 1450,
    mrp: 1800,
    rating: 4.9,
    reviewsCount: 46,
    badge: 'Customisable',
    image: 'https://images.unsplash.com/photo-1609137144822-473d09a0684f?auto=format&fit=crop&w=700&q=80',
    description: 'Auspicious Kalash & lotus door banner customized with family surname and house number for housewarming ceremonies and front porch blessings.',
    materials: 'Engraved teak finish wood with brass bell pendants.',
    dimensions: '18 x 7 inches.',
    inStock: true
  },

  // --- Category 7: Handmade Bangles ---
  {
    id: 'ban-set-01',
    name: 'Traditional Maharashtrian Green Chuda & Pearl Tode Set',
    marathiName: 'पारंपरिक हिरवा चुडा आणि मोत्यांचे तोडे सेट',
    category: 'Handmade Bangles',
    price: 1799,
    mrp: 2250,
    rating: 5.0,
    reviewsCount: 91,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80',
    description: 'Complete 48-piece bridal chuda ensemble containing authentic dark green glass bangles bordered by handcrafted Basra pearl tode, golden pacheli kadas, and ruby accents.',
    materials: 'Traditional Kolhapuri green glass, hand-wired pearl tode, gold plated brass.',
    dimensions: 'Sizes available: 2.4, 2.6, 2.8 and custom fit.',
    inStock: true
  },
  {
    id: 'ban-set-02',
    name: 'Royal Maroon Velvet & Kundan Stone Kada Pair',
    marathiName: 'शाही मखमली व कुंदन कडे जोडी',
    category: 'Handmade Bangles',
    price: 1299,
    mrp: 1600,
    rating: 4.8,
    reviewsCount: 37,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80',
    description: 'Broad bridal kadas wrapped in plush maroon velvet, encircled with flower-shaped kundan stones and tiny dangling gold ghungroos.',
    materials: 'Plush velvet, faceted kundan crystals, micro golden bells.',
    dimensions: 'Width: 1.25 inches per kada.',
    inStock: true
  },
  {
    id: 'ban-set-03',
    name: 'Silk Thread Festive Bangles with Latkan Charms',
    marathiName: 'रेशमी धाग्यांच्या बांगड्या आणि लटकन',
    category: 'Handmade Bangles',
    price: 999,
    mrp: 1299,
    rating: 4.7,
    reviewsCount: 26,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=700&q=80',
    description: 'Artisan hand-wound silk thread bangles in matching maroon and antique gold shades with detachable pearl drop latkans for Sangeet & Haldi ceremonies.',
    materials: 'Pure silk yarn, metal bangle core, pearl tassels.',
    dimensions: 'Set of 12 silk bangles + 2 latkans.',
    inStock: true
  },

  // --- Category 8: Traditional Decorations and Toran ---
  {
    id: 'tor-01',
    name: 'Marigold Blossom & Brass Bell Sacred Door Toran',
    marathiName: 'झेंडूची फुले आणि पितळी घंटा प्रवेशद्वार तोरण',
    category: 'Traditional Decorations and Toran',
    price: 1399,
    mrp: 1799,
    rating: 5.0,
    reviewsCount: 78,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1609137144822-473d09a0684f?auto=format&fit=crop&w=700&q=80',
    description: 'Lush everlasting marigold garlands in auspicious saffron and yellow, accented with mango leaves, Basra pearl droplets, and solid resonating brass bells.',
    materials: 'High-density silk-poly florals, genuine brass bells, sturdy hanging ring loops.',
    dimensions: 'Length: 3.5 feet (Standard Indian Doorway Frame).',
    inStock: true
  },
  {
    id: 'tor-02',
    name: 'Handcrafted Shola Wood Lotus & Pearl Door Hanging',
    marathiName: 'हस्तनिर्मित शोला कमळ आणि मोती तोरण',
    category: 'Traditional Decorations and Toran',
    price: 1650,
    mrp: 2100,
    rating: 4.9,
    reviewsCount: 44,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80',
    description: 'Eco-friendly biodegradable shola pith carved into delicate pristine white and pink tipped lotuses, interstrung with golden beads and circular mirror work.',
    materials: 'Shola natural plant pith, glass beads, mirror discs.',
    dimensions: 'Length: 4 feet.',
    inStock: true
  },
  {
    id: 'tor-03',
    name: 'Paithani Peacock Ceremonial Wall Backdrop Toran',
    marathiName: 'पैठणी मोर नक्षीदार पूजेचे तोरण',
    category: 'Traditional Decorations and Toran',
    price: 2250,
    mrp: 2800,
    rating: 4.8,
    reviewsCount: 33,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    description: 'Decorative fabric hanging strip woven with traditional Paithani Mor-Pankh motifs and gold zari border, ideal for home Ganpati, pooja altars, and wedding mandates.',
    materials: 'Paithani silk weave border, golden zari, mirror latkans.',
    dimensions: 'Length: 5 feet x Width: 8 inches.',
    inStock: true
  },

  // --- Category 9: Customized Outfits ---
  {
    id: 'outfit-01',
    name: 'Paithani Motif Pure Silk Kurti (Custom Tailored)',
    marathiName: 'पैठणी मोर नक्षीदार शुद्ध रेशमी कुर्ती',
    category: 'Customized Outfits',
    price: 1850,
    mrp: 2450,
    rating: 5.0,
    reviewsCount: 48,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
    description: 'Bespoke handloom silk kurti tailored to your choice of neckline and sleeve length, accented with authentic Yeola Paithani woven peacock motifs and zari borders. Starting price is a demo price.',
    materials: 'Pure silk yarn, handloom Paithani border, soft pre-shrunk cotton lining.',
    dimensions: 'Sizes: XS, S, M, L, XL, XXL or Custom Made-to-Measure.',
    inStock: true
  },
  {
    id: 'outfit-02',
    name: 'Royal Bridal Zardozi Silk Blouse (Parijaat Cut)',
    marathiName: 'शाही भरतकाम नवरीचा रेशमी ब्लाऊज',
    category: 'Customized Outfits',
    price: 2450,
    mrp: 3100,
    rating: 4.9,
    reviewsCount: 62,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
    description: 'Exquisite bridal designer blouse with Parijaat florals, zardozi gold wire work, built-in soft padding, deep back neckline with matching bell latkans. Starting price is a demo price.',
    materials: 'Micro raw silk, metallic zardozi threads, glass stones, padded bra cups.',
    dimensions: 'Custom stitched with 2-inch inner side alteration margins.',
    inStock: true
  },
  {
    id: 'outfit-03',
    name: 'Traditional Nauvari & Paithani Festive Ensemble',
    marathiName: 'पारंपरिक नऊवारी व पैठणी डिझायनर पोशाख',
    category: 'Customized Outfits',
    price: 4999,
    mrp: 6500,
    rating: 5.0,
    reviewsCount: 39,
    badge: 'Customisable',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
    description: 'Ready-to-wear pre-pleated traditional Maharashtrian 9-yard Nauvari look coordinated with contrasting designer blouse and matching festive shela. Starting price is a demo price.',
    materials: 'Rich art silk Paithani weave, gold zari border, stitched cotton waistband.',
    dimensions: 'Customized according to client height and waist measurements.',
    inStock: true
  },
  {
    id: 'outfit-04',
    name: 'Festive Kurta Set & Custom Stitching Order',
    marathiName: 'सण-उत्सव कुर्ता-दुपट्टा सेट आणि टेलरिंग',
    category: 'Customized Outfits',
    price: 1200,
    mrp: 1650,
    rating: 4.8,
    reviewsCount: 27,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80',
    description: 'Bespoke tailoring and stitching service for customer-provided fabrics or hand-crafted festive kurta-dupatta coordinates with hand-piped zari finishing. Starting price is a demo price.',
    materials: 'Custom fabric tailored to precision with double-locked seams and interlock.',
    dimensions: 'Customized to your submitted measurements.',
    inStock: true
  },

  // --- Category 10: Customized Blouses ---
  {
    id: 'blouse-01',
    name: 'Royal Paithani Peacock Zari Bridal Blouse',
    marathiName: 'शाही पैठणी मोर नक्षीदार भरतकाम ब्लाऊज',
    category: 'Customized Blouses',
    price: 2450,
    mrp: 3100,
    rating: 5.0,
    reviewsCount: 58,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
    description: 'Bespoke handloom silk blouse featuring Yeola Paithani woven peacock border on elbow sleeves, Parijaat zardozi motifs, deep back neckline with matching bell latkans, and 2-inch alteration allowance. Starting price is a demo price.',
    materials: 'Micro raw silk, metallic zardozi threads, glass stones, padded bra cups.',
    dimensions: 'Custom stitched with 2-inch inner side alteration margins.',
    inStock: true
  },
  {
    id: 'blouse-02',
    name: 'Maggam Work Kundan & Pearl Bridal Blouse',
    marathiName: 'माग्गम वर्क मोती व कुंदन भरतकाम ब्लाऊज',
    category: 'Customized Blouses',
    price: 2899,
    mrp: 3600,
    rating: 4.9,
    reviewsCount: 41,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
    description: 'Elaborate Maggam hand embroidery in pure antique gold thread, pearl clusters, and crimson stone border detailing. Built-in bra padding and cotton lining included. Starting price is a demo price.',
    materials: 'Pure silk base, Basra pearl droplets, gold zardozi and kundan stones.',
    dimensions: 'Sizes: XS to XXL or Custom Made-to-Measure.',
    inStock: true
  },
  {
    id: 'blouse-03',
    name: 'Princess Cut Raw Silk Temple Border Blouse',
    marathiName: 'प्रिन्सेस कट रॉ सिल्क टेंपल काठ ब्लाऊज',
    category: 'Customized Blouses',
    price: 1850,
    mrp: 2350,
    rating: 4.8,
    reviewsCount: 34,
    badge: 'Customisable',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80',
    description: 'Minimalist royal elegance with temple zari borders along neckline and sleeves. Front or back closure options tailored to your comfort and exact bust/waist dimensions. Starting price is a demo price.',
    materials: 'Handloom raw silk, gold zari border, breathable cotton lining.',
    dimensions: 'Custom tailored with padded cups and side zipper option.',
    inStock: true
  },

  // --- Category 11: Ring Platter ---
  {
    id: 'ring-01',
    name: 'Royal Peacock Feather & Blue Velvet Ring Platter',
    marathiName: 'शाही मोरपंख व निळी मखमली साखरपुडा अंगठी थाळी',
    category: 'Ring Platter',
    price: 2499,
    mrp: 3200,
    rating: 5.0,
    reviewsCount: 89,
    badge: 'Bestseller',
    image: 'images/bhami-ring-platter-peacock-blue.jpg',
    description: 'Grand engagement ring platter featuring a handcrafted floral arch in royal & powder blue roses, authentic iridescent peacock feathers, personalized gold mirror circular couple name plaque ("Mamta ❤️ Amit"), and a tiered royal blue satin ring pedestal.',
    materials: 'Engineered wood base, rich velvet and satin fabric, natural peacock feathers, artificial velvet roses, gold mirror acrylic.',
    dimensions: 'Diameter: 12 inches circular platter, Height: 14 inches arch.',
    inStock: true
  },
  {
    id: 'ring-02',
    name: 'Suspended Glass Orb Ring Ceremony Platter',
    marathiName: 'काचेचे तरंगते गोळे व गुलाबी मखमली अंगठी तबक',
    category: 'Ring Platter',
    price: 2799,
    mrp: 3500,
    rating: 5.0,
    reviewsCount: 76,
    badge: 'Bestseller',
    image: 'images/bhami-ring-platter-glass-globe-orbs.jpg',
    description: 'Showstopper engagement ring platter crafted on a blush-pink velvet upholstered square pedestal with pearl border. Features twin suspended transparent glass baubles holding golden filigree ring cushions beneath a floral hoop with gold acrylic script ("Gayatri ❤️ Sharad").',
    materials: 'Blush pink velvet pedestal, heavy pearl trim, clear blown-glass globes, golden filigree ring cups, silk peony roses, gold acrylic script.',
    dimensions: 'Base: 9 x 9 inches square | Hoop Height: 15 inches.',
    inStock: true
  },
  {
    id: 'ring-03',
    name: 'Blush Pink Geode Resin & Crystal Ring Platter',
    marathiName: 'गुलाबी राळ जिओड व स्फटिक साखरपुडा अंगठी थाळी',
    category: 'Ring Platter',
    price: 2650,
    mrp: 3300,
    rating: 4.9,
    reviewsCount: 58,
    badge: 'Handcrafted',
    image: 'images/bhami-ring-platter-pink-resin-geode.jpg',
    description: 'Artistic epoxy resin engagement platter crafted with scalloped raw geode edges, gold glitter veining, and pearl clusters. Features a suspended personalized monogram medallion ("M & H", Date 02.12.2025), floral hoop arch, and dual faceted crystal glass ring boxes.',
    materials: 'UV-resistant epoxy resin, real pearl chips, gold leaf flakes, faceted crystal ring boxes, golden hoop, artificial tea roses.',
    dimensions: '12 inches diameter resin platter, 13 inches total height.',
    inStock: true
  },
  {
    id: 'ring-04',
    name: 'Classic White Rose & Pearl Hoop Ring Platter',
    marathiName: 'शुभ्र गुलाब व मोत्यांची वर्तुळाकार अंगठी थाळी',
    category: 'Ring Platter',
    price: 2199,
    mrp: 2750,
    rating: 4.9,
    reviewsCount: 62,
    badge: 'Customisable',
    image: 'images/bhami-ring-platter-white-floral-pearl.jpg',
    description: 'Serene and regal engagement ring platter featuring a full halo of pristine white roses, micro-pearl edge trim, central gold mirror circular plaque ("Anjali ❤️ Sachin"), draped mauve velvet base, and twin pearl-embellished golden filigree ring holders.',
    materials: 'MDF wooden base, mauve velvet draping, white ranunculus flowers, pearl beading, 22K gold-polished metal ring cups, gold acrylic plaque.',
    dimensions: 'Diameter: 12 inches circular base, 14 inches hoop height.',
    inStock: true
  },
  {
    id: 'ring-05',
    name: 'Vibrant Multicolor Floral Ring Arch with Dual Velvet Boxes',
    marathiName: 'रंगीबेरंगी पुष्प कमान व दुहेरी मखमली बॉक्स अंगठी थाळी',
    category: 'Ring Platter',
    price: 2350,
    mrp: 2950,
    rating: 4.9,
    reviewsCount: 45,
    badge: 'New',
    image: 'images/bhami-ring-platter-floral-arch-boxes.jpg',
    description: 'Festive engagement ring platter designed with a grand floral ring arch of colorful miniature satin roses, suspended gold calligraphy names ("Saroj ❤️ Pavan"), deep brown velvet tray bordered with Basra pearls, and two royal purple velvet ring boxes.',
    materials: 'Wooden circular tray, Basra pearl border lace, miniature satin florets, gold acrylic names, twin purple velvet ring boxes.',
    dimensions: 'Diameter: 12.5 inches circular platter, 14 inches hoop.',
    inStock: true
  },

  // --- Category 12: Embroidery Frame ---
  {
    id: 'emb-01',
    name: 'Royal Marathi Paithani Wedding Calendar Embroidery Hoop Frame',
    marathiName: 'शाही पैठणी नऊवारी लग्न कॅलेंडर भरतकाम फ्रेम',
    category: 'Embroidery Frame',
    price: 2199,
    mrp: 2799,
    rating: 5.0,
    reviewsCount: 82,
    badge: 'Bestseller',
    image: 'images/bhami-embroidery-marathi-paithani.jpg',
    description: 'Signature Maharashtrian wedding keepsake hoop frame personalized with Marathi calligraphy ("अनिषा ❤️ धनंजय #धनिषा"), wedding calendar highlight, 3D draped magenta Paithani Nauvari saree with golden zari pallu, groom shela, and golden coin lace border.',
    materials: 'Beechwood hoop, pure silk Paithani fabric, hand-embroidered floral tiara, metallic coin lace, gold zari thread.',
    dimensions: '10 inches diameter wooden embroidery hoop frame.',
    inStock: true
  },
  {
    id: 'emb-02',
    name: 'Emerald Green Saree & Sherwani Couple Embroidery Hoop',
    marathiName: 'पाचू हिरवी साडी व शेरवानी जोडपे भरतकाम फ्रेम',
    category: 'Embroidery Frame',
    price: 1999,
    mrp: 2500,
    rating: 5.0,
    reviewsCount: 64,
    badge: 'Handcrafted',
    image: 'images/bhami-embroidery-green-saree-rings.jpg',
    description: 'Exquisite keepsake hoop frame featuring couple name embroidery ("Shubhada ❤️ Shubham"), wedding date with embroidered interlocking gold wedding rings, 3D pleated emerald green saree with designer back blouse, white sherwani, and lustrous pearl rim.',
    materials: 'Wooden hoop, satin-finish canvas, 3D pleated organza & silk fabric, French knot floral crescent, faux pearl border.',
    dimensions: '10 inches diameter circular wooden frame.',
    inStock: true
  },
  {
    id: 'emb-03',
    name: 'Shwetam Traditional Nauvari Calendar Keepsake Embroidery Hoop',
    marathiName: 'पारंपरिक नऊवारी व शेला विवाह दिनदर्शिका भरतकाम फ्रेम',
    category: 'Embroidery Frame',
    price: 2250,
    mrp: 2850,
    rating: 4.9,
    reviewsCount: 53,
    badge: 'Customisable',
    image: 'images/bhami-embroidery-nauvari-calendar.jpg',
    description: 'Bespoke wedding calendar hoop customized with couple hashtag ("#श्वेतम"), February calendar with heart-marked wedding date, hand-embroidered floral crest, 3D traditional purple-red Paithani Nauvari saree, and antique gold coin lace.',
    materials: 'Premium wooden hoop frame, raw silk, genuine zari brocade border, Anchor cotton threads, metallic coin trim.',
    dimensions: '10 inches diameter circular hoop frame.',
    inStock: true
  },
  {
    id: 'emb-04',
    name: 'Royal Red Zardozi Bridal Lehenga Embroidery Frame',
    marathiName: 'शाही लाल झरदोझी नवरी लेहेंगा भरतकाम फ्रेम',
    category: 'Embroidery Frame',
    price: 2399,
    mrp: 2999,
    rating: 5.0,
    reviewsCount: 71,
    badge: 'Bestseller',
    image: 'images/bhami-embroidery-red-lehenga.jpg',
    description: 'Opulent keepsake hoop frame adorned with a 3D flared crimson red bridal lehenga with heavy zardozi gold border, sheer embroidered dupatta, vintage streetlamp embroidery, floral arch, and full pearl rim.',
    materials: 'Beechwood hoop, raw silk, micro-velvet & net bridal lehenga fabric, gold zardozi laces, pearl bead edging.',
    dimensions: '10 inches diameter wooden hoop frame.',
    inStock: true
  },
  {
    id: 'emb-05',
    name: 'Wine Flared Gown & Floral Heart Keepsake Embroidery Hoop',
    marathiName: 'मखमली वाइन गाऊन व पुष्प हृदय भरतकाम हूप',
    category: 'Embroidery Frame',
    price: 1899,
    mrp: 2399,
    rating: 4.9,
    reviewsCount: 48,
    badge: 'New',
    image: 'images/bhami-embroidery-wine-gown.jpg',
    description: 'Romantic anniversary & engagement keepsake hoop frame featuring couple names ("Neel ❤️ Ami"), wedding date, an intricately embroidered heart-shaped rose wreath, 3D flared wine-purple gown with gold scalloped lace, and matching ribbon bow.',
    materials: 'Wooden hoop, linen canvas, raw silk flared gown with zari lace, cotton embroidery floss, wine satin bow.',
    dimensions: '10 inches diameter circular wooden hoop frame.',
    inStock: true
  }
];

// ==========================================================================
// 2. STATE & LOCALSTORAGE MANAGEMENT
// ==========================================================================

const STATE = {
  products: PRODUCTS_DATA,
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  cart: [],
  wishlist: new Set(),
  appliedCoupon: null, // { code: 'BHAMI10', discountPercent: 10 } or { code: 'UTSAV', discountFixed: 200 }
  activeModalProduct: null
};

// Storage Keys
const STORAGE_CART_KEY = 'bhami_boutique_cart_v1';
const STORAGE_WISHLIST_KEY = 'bhami_boutique_wishlist_v1';

/**
 * Load cart and wishlist from LocalStorage safely
 */
function loadStateFromStorage() {
  try {
    const savedCart = localStorage.getItem(STORAGE_CART_KEY);
    if (savedCart) {
      STATE.cart = JSON.parse(savedCart);
    }
  } catch (err) {
    console.error('Error loading cart from storage', err);
    STATE.cart = [];
  }

  try {
    const savedWishlist = localStorage.getItem(STORAGE_WISHLIST_KEY);
    if (savedWishlist) {
      const arr = JSON.parse(savedWishlist);
      STATE.wishlist = new Set(arr);
    }
  } catch (err) {
    console.error('Error loading wishlist from storage', err);
    STATE.wishlist = new Set();
  }
}

/**
 * Persist cart to LocalStorage
 */
function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(STATE.cart));
  } catch (err) {
    console.error('Error saving cart to storage', err);
  }
}

/**
 * Persist wishlist to LocalStorage
 */
function saveWishlistToStorage() {
  try {
    localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(Array.from(STATE.wishlist)));
  } catch (err) {
    console.error('Error saving wishlist to storage', err);
  }
}

// ==========================================================================
// 3. UI RENDERING & PRODUCT CATALOGUE LOGIC
// ==========================================================================

/**
 * Filter, sort, and render products grid
 */
function renderProductGrid() {
  const gridEl = document.getElementById('productsGrid');
  const countEl = document.getElementById('resultsCount');
  const noStateEl = document.getElementById('noProductsState');
  const activeFilterIndicator = document.getElementById('activeFilterIndicator');
  const currentFilterText = document.getElementById('currentFilterText');

  if (!gridEl) return;

  // Filter products
  let filtered = STATE.products.filter(item => {
    // Category check
    const matchesCategory = (STATE.activeCategory === 'all') || (item.category === STATE.activeCategory);
    
    // Search query check (name, category, description, marathiName)
    const q = STATE.searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.marathiName && item.marathiName.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // Sort products
  switch (STATE.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating-high':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      // Keep curated order
      break;
  }

  // Update counts & empty state
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${STATE.products.length} products`;
  }

  if (activeFilterIndicator && currentFilterText) {
    if (STATE.activeCategory !== 'all' || STATE.searchQuery.trim() !== '') {
      let desc = '';
      if (STATE.activeCategory !== 'all') desc += `Category: "${STATE.activeCategory}"`;
      if (STATE.searchQuery.trim()) {
        if (desc) desc += ' & ';
        desc += `Search: "${STATE.searchQuery}"`;
      }
      currentFilterText.textContent = desc;
      activeFilterIndicator.style.display = 'flex';
    } else {
      activeFilterIndicator.style.display = 'none';
    }
  }

  if (filtered.length === 0) {
    gridEl.innerHTML = '';
    if (noStateEl) noStateEl.style.display = 'block';
    return;
  }

  if (noStateEl) noStateEl.style.display = 'none';

  // Render product cards
  gridEl.innerHTML = filtered.map(product => {
    const isWishlisted = STATE.wishlist.has(product.id);
    let badgeClass = 'badge-handcrafted';
    if (product.badge === 'Bestseller') badgeClass = 'badge-bestseller';
    if (product.badge === 'New') badgeClass = 'badge-new';
    if (product.badge === 'Customisable') badgeClass = 'badge-custom';

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-top-media">
          <img 
            src="${product.image}" 
            alt="${escapeHtml(product.name)}" 
            class="product-img" 
            loading="lazy"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80';"
          >
          <div class="card-badges">
            <span class="product-badge ${badgeClass}">${product.badge}</span>
          </div>

          <button class="card-wishlist-toggle ${isWishlisted ? 'active' : ''}" 
                  data-action="wishlist" 
                  data-id="${product.id}" 
                  aria-label="Save ${escapeHtml(product.name)} to wishlist"
                  title="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>

          <button class="card-quick-view-btn" data-action="quickview" data-id="${product.id}">
            <i class="fa-solid fa-eye"></i> Quick View
          </button>
        </div>

        <div class="card-body">
          <span class="card-category-name">${escapeHtml(product.category)}</span>
          <h3 class="card-title" data-action="quickview" data-id="${product.id}">
            ${escapeHtml(product.name)}
          </h3>

          <div class="card-rating">
            <span class="stars">${renderStars(product.rating)}</span>
            <span class="rating-val">${product.rating.toFixed(1)}</span>
            <span class="rating-count">(${product.reviewsCount})</span>
          </div>

          <p class="card-short-desc">${escapeHtml(product.description)}</p>

          <div class="card-bottom-bar">
            <div class="price-box">
              <span class="price-current">₹${product.price.toLocaleString('en-IN')}</span>
              <span class="price-mrp">₹${product.mrp.toLocaleString('en-IN')}</span>
            </div>

            <button class="btn-add-cart" data-action="add-cart" data-id="${product.id}" aria-label="Add ${escapeHtml(product.name)} to shopping bag">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Generate star rating HTML string
 */
function renderStars(rating) {
  let stars = '';
  const rounded = Math.round(rating);
  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      stars += '<i class="fa-solid fa-star"></i>';
    } else {
      stars += '<i class="fa-regular fa-star"></i>';
    }
  }
  return stars;
}

// ==========================================================================
// 4. CART LOGIC & DRAWER MANAGEMENT
// ==========================================================================

/**
 * Add a product to the cart
 */
function addToCart(productId, quantity = 1, showDrawer = true) {
  const product = STATE.products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = STATE.cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    STATE.cart[existingItemIndex].quantity += quantity;
  } else {
    STATE.cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCartToStorage();
  updateCartUI();
  showToast(`Added "${product.name}" to your bag!`, 'success');

  if (showDrawer) {
    openCartDrawer();
  }
}

/**
 * Update quantity of a cart item
 */
function updateCartItemQty(productId, newQty) {
  const itemIndex = STATE.cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  if (newQty <= 0) {
    const item = STATE.cart[itemIndex];
    STATE.cart.splice(itemIndex, 1);
    showToast(`Removed "${item.name}" from your bag`, 'info');
  } else {
    STATE.cart[itemIndex].quantity = newQty;
  }

  saveCartToStorage();
  updateCartUI();
}

/**
 * Remove an item completely from cart
 */
function removeCartItem(productId) {
  const itemIndex = STATE.cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const item = STATE.cart[itemIndex];
    STATE.cart.splice(itemIndex, 1);
    saveCartToStorage();
    updateCartUI();
    showToast(`Removed "${item.name}" from your bag`, 'info');
  }
}

/**
 * Clear the entire cart
 */
function clearCart() {
  if (STATE.cart.length === 0) return;
  STATE.cart = [];
  STATE.appliedCoupon = null;
  saveCartToStorage();
  updateCartUI();
  showToast('Your shopping bag is now empty.', 'info');
}

/**
 * Calculate totals: subtotal, discount, shipping, grand total
 */
function calculateCartTotals() {
  const subtotal = STATE.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (STATE.appliedCoupon) {
    if (STATE.appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * STATE.appliedCoupon.discountPercent) / 100);
    } else if (STATE.appliedCoupon.discountFixed) {
      discount = Math.min(subtotal, STATE.appliedCoupon.discountFixed);
    }
  }

  // Free shipping above ₹999 or empty
  let shipping = 0;
  if (subtotal > 0 && subtotal < 999) {
    shipping = 99;
  }

  const grandTotal = Math.max(0, subtotal - discount + shipping);

  return { subtotal, discount, shipping, grandTotal };
}

/**
 * Update cart badge counts, item lists, and totals
 */
function updateCartUI() {
  const totalItemCount = STATE.cart.reduce((acc, item) => acc + item.quantity, 0);

  // Update header badges
  const headerBadge = document.getElementById('cartBadgeCount');
  const cartDrawerCount = document.getElementById('cartTotalItemsCount');
  if (headerBadge) headerBadge.textContent = totalItemCount;
  if (cartDrawerCount) cartDrawerCount.textContent = `${totalItemCount} item${totalItemCount === 1 ? '' : 's'}`;

  // Update wishlist count badge
  const wishlistBadge = document.getElementById('wishlistCount');
  if (wishlistBadge) wishlistBadge.textContent = STATE.wishlist.size;

  const emptyView = document.getElementById('cartEmptyView');
  const contentView = document.getElementById('cartContentView');
  const itemsList = document.getElementById('cartItemsList');

  if (!emptyView || !contentView || !itemsList) return;

  if (STATE.cart.length === 0) {
    emptyView.style.display = 'flex';
    contentView.style.display = 'none';
    return;
  }

  emptyView.style.display = 'none';
  contentView.style.display = 'flex';

  // Render cart items
  itemsList.innerHTML = STATE.cart.map(item => `
    <div class="cart-item-row" data-id="${item.id}">
      <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80';">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
        <span class="cart-item-category">${escapeHtml(item.category)}</span>
        <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>

        <div class="cart-item-qty-bar">
          <div class="cart-item-stepper">
            <button class="cart-stepper-btn" data-cart-action="dec" data-id="${item.id}" aria-label="Decrease quantity">-</button>
            <span class="cart-stepper-qty">${item.quantity}</span>
            <button class="cart-stepper-btn" data-cart-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>

          <button class="cart-item-remove-btn" data-cart-action="remove" data-id="${item.id}" aria-label="Remove item">
            <i class="fa-regular fa-trash-can"></i> Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Calculations
  const { subtotal, discount, shipping, grandTotal } = calculateCartTotals();

  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountVal = document.getElementById('cartDiscountVal');
  const shippingVal = document.getElementById('cartShippingVal');
  const grandTotalEl = document.getElementById('cartGrandTotal');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  
  if (discountRow && discountVal) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountVal.textContent = `- ₹${discount.toLocaleString('en-IN')}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (shippingVal) {
    shippingVal.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
  }

  if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

/**
 * Open cart slide-over drawer
 */
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close cart slide-over drawer
 */
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================================================
// 5. PRODUCT DETAILS MODAL (QUICK VIEW)
// ==========================================================================

/**
 * Open Product Quick View modal with rich details
 */
function openProductModal(productId) {
  const product = STATE.products.find(p => p.id === productId);
  if (!product) return;

  STATE.activeModalProduct = product;
  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('productModalBackdrop');
  const content = document.getElementById('productModalContent');

  if (!modal || !backdrop || !content) return;

  content.innerHTML = `
    <div class="modal-product-media">
      <img src="${product.image}" alt="${escapeHtml(product.name)}" class="modal-product-img" onerror="this.src='https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80';">
    </div>
    <div class="modal-product-info">
      <div class="modal-product-category">${escapeHtml(product.category)} • ${product.badge}</div>
      <h2 class="modal-product-title" id="modalProductTitle">${escapeHtml(product.name)}</h2>
      ${product.marathiName ? `<div style="font-size:0.95rem; color:#741F2B; font-weight:600; margin-bottom:0.5rem;">${escapeHtml(product.marathiName)}</div>` : ''}

      <div class="modal-product-rating">
        <span>${renderStars(product.rating)}</span>
        <strong>${product.rating.toFixed(1)} / 5.0</strong>
        <span class="text-muted">(${product.reviewsCount} verified reviews)</span>
      </div>

      <div class="modal-product-price">
        <span>₹${product.price.toLocaleString('en-IN')}</span>
        <del>₹${product.mrp.toLocaleString('en-IN')}</del>
        <span style="font-size:0.85rem; color:#2B7A48; font-weight:600; margin-left:0.5rem;">Save ₹${(product.mrp - product.price).toLocaleString('en-IN')}</span>
      </div>

      <p class="modal-product-desc">${escapeHtml(product.description)}</p>

      <div class="modal-specs-list">
        <div><strong>Materials:</strong> ${escapeHtml(product.materials)}</div>
        <div><strong>Specifications:</strong> ${escapeHtml(product.dimensions)}</div>
        <div><strong>Availability:</strong> <span class="text-success"><i class="fa-solid fa-circle-check"></i> In Stock & Ready to Dispatch</span></div>
      </div>

      <div class="modal-actions-row">
        <button class="btn btn-gold btn-lg" id="modalAddToCartBtn" data-id="${product.id}">
          <i class="fa-solid fa-bag-shopping"></i> Add to Bag
        </button>
        <button class="btn btn-outline-gold" id="modalCustomiseBtn" data-category="${escapeHtml(product.category)}" data-name="${escapeHtml(product.name)}">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Customise This
        </button>
      </div>
    </div>
  `;

  // Attach modal action listeners
  const modalAddBtn = document.getElementById('modalAddToCartBtn');
  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      addToCart(product.id, 1, true);
      closeProductModal();
    });
  }

  const modalCustomiseBtn = document.getElementById('modalCustomiseBtn');
  if (modalCustomiseBtn) {
    modalCustomiseBtn.addEventListener('click', () => {
      closeProductModal();

      if (product.category === 'Customized Outfits') {
        const outfitsSection = document.getElementById('customized-outfits');
        const outfitSelect = document.getElementById('outfitTypeSelect');
        if (outfitSelect) {
          if (product.name.includes('Kurti')) outfitSelect.value = 'Customized Kurtis';
          else if (product.name.includes('Blouse')) outfitSelect.value = 'Blouses';
          else if (product.name.includes('Nauvari') || product.name.includes('Ensemble')) outfitSelect.value = 'Traditional ethnic outfits';
          else outfitSelect.value = 'Custom stitching orders';
          outfitSelect.dispatchEvent(new Event('change'));
        }
        if (outfitsSection) {
          outfitsSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // Scroll to custom order section and pre-fill category
      const customSection = document.getElementById('custom-order');
      const catSelect = document.getElementById('custProductType');
      const customTextInput = document.getElementById('custCustomText');

      if (catSelect) {
        catSelect.value = product.category;
        catSelect.dispatchEvent(new Event('change'));
      }
      if (customTextInput) {
        customTextInput.placeholder = `Customization for ${product.name}...`;
        customTextInput.focus();
      }
      if (customSection) {
        customSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  modal.classList.add('open');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close Product Quick View modal
 */
function closeProductModal() {
  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('productModalBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================================================
// 6. CUSTOM ORDER FORM & LIVE SPECIMEN PREVIEW
// ==========================================================================

// State for Custom Order Reference Photos Upload
let customUploadedImages = [];
let activeReplaceIndex = null;
const STORAGE_KEY_ADMIN_ORDERS = 'bhami_admin_orders';

/**
 * Format bytes into human-readable size
 */
function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '0 KB';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

/**
 * Client-side canvas image downscaler for safe localStorage storage (Max 1000px, 0.85 JPEG)
 */
function downscaleImage(file, maxDim = 1000, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl, width, height });
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}

function setupCustomOrderBuilder() {
  const form = document.getElementById('customOrderForm');
  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  const productSelect = document.getElementById('custProductType');
  const dateInput = document.getElementById('custEventDate');
  const customTextInput = document.getElementById('custCustomText');
  const qtyInput = document.getElementById('custQuantity');
  const incBtn = document.getElementById('incCustQty');
  const decBtn = document.getElementById('decCustQty');
  const cityInput = document.getElementById('custCity');
  const budgetInput = document.getElementById('custBudget');
  const instructionsInput = document.getElementById('custInstructions');

  // File Upload Elements
  const dropzone = document.getElementById('custFileDropzone');
  const fileInput = document.getElementById('custReferenceUpload');
  const replaceInput = document.getElementById('custReplaceUpload');
  const previewsContainer = document.getElementById('custPreviewsContainer');
  const countBadge = document.getElementById('custUploadCountBadge');

  // Preview elements
  const previewTitle = document.getElementById('previewDisplayTitle');
  const previewCategory = document.getElementById('previewDisplayCategory');
  const previewName = document.getElementById('previewDisplayName');
  const previewDate = document.getElementById('previewDisplayDate');
  const previewQty = document.getElementById('previewDisplayQty');
  const previewCity = document.getElementById('previewDisplayCity');
  const previewBudget = document.getElementById('previewDisplayBudget');
  const previewInstructionsBox = document.getElementById('previewInstructionsBox');
  const previewInstructions = document.getElementById('previewDisplayInstructions');
  const previewPhotosStrip = document.getElementById('previewPhotosStrip');
  const previewPhotosCount = document.getElementById('previewPhotosCount');
  const previewPlate = document.getElementById('previewPlate');

  // Set default minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // 1. Live text / Inscription update
  if (customTextInput && previewTitle) {
    customTextInput.addEventListener('input', () => {
      const val = customTextInput.value.trim();
      previewTitle.textContent = val || 'Your Custom Names Here';
    });
  }

  // 2. Live name update
  if (nameInput && previewName) {
    nameInput.addEventListener('input', () => {
      const val = nameInput.value.trim();
      previewName.textContent = val || 'Guest Customer';
    });
  }

  // 3. Live category update
  if (productSelect && previewCategory) {
    productSelect.addEventListener('change', () => {
      previewCategory.textContent = productSelect.value || 'Selected Product Category';
    });
  }

  // 4. Live date update
  if (dateInput && previewDate) {
    dateInput.addEventListener('change', () => {
      if (dateInput.value) {
        const parts = dateInput.value.split('-');
        previewDate.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        previewDate.textContent = 'To be specified';
      }
    });
  }

  // 5. Live city update
  if (cityInput && previewCity) {
    cityInput.addEventListener('input', () => {
      const val = cityInput.value.trim();
      previewCity.textContent = val || 'To be specified';
    });
  }

  // 6. Live Expected Budget update
  if (budgetInput && previewBudget) {
    budgetInput.addEventListener('input', () => {
      const val = budgetInput.value.trim();
      if (val && !isNaN(val) && Number(val) > 0) {
        previewBudget.textContent = `₹${Number(val).toLocaleString('en-IN')}`;
        previewBudget.classList.add('text-gold');
      } else {
        previewBudget.textContent = 'Not specified';
        previewBudget.classList.remove('text-gold');
      }
    });
  }

  // 7. Live Customization Instructions update
  if (instructionsInput && previewInstructions && previewInstructionsBox) {
    instructionsInput.addEventListener('input', () => {
      const val = instructionsInput.value.trim();
      if (val) {
        previewInstructions.textContent = val;
        previewInstructionsBox.style.display = 'block';
      } else {
        previewInstructions.textContent = 'Standard craftsmanship';
        previewInstructionsBox.style.display = 'none';
      }
    });
  }

  // 8. Live quantity stepper
  if (incBtn && qtyInput) {
    incBtn.addEventListener('click', () => {
      let cur = parseInt(qtyInput.value) || 1;
      if (cur < 250) {
        qtyInput.value = cur + 1;
        updateQtyPreview();
      }
    });
  }
  if (decBtn && qtyInput) {
    decBtn.addEventListener('click', () => {
      let cur = parseInt(qtyInput.value) || 1;
      if (cur > 1) {
        qtyInput.value = cur - 1;
        updateQtyPreview();
      }
    });
  }
  if (qtyInput) {
    qtyInput.addEventListener('input', updateQtyPreview);
  }

  function updateQtyPreview() {
    if (previewQty && qtyInput) {
      const val = parseInt(qtyInput.value) || 1;
      previewQty.textContent = `${val} Unit${val > 1 ? 's' : ''}`;
    }
  }

  // 9. Reference Image Upload, Previews, Remove & Replace Options
  function renderCustomImagePreviews() {
    const total = customUploadedImages.length;

    if (countBadge) {
      countBadge.textContent = `${total} / 5 Uploaded`;
    }

    if (dropzone) {
      const textPrimary = dropzone.querySelector('.dropzone-text-primary');
      if (total >= 5) {
        dropzone.classList.add('disabled');
        if (textPrimary) textPrimary.textContent = 'Maximum 5 reference photos reached';
      } else {
        dropzone.classList.remove('disabled');
        if (textPrimary) textPrimary.textContent = 'Click to Browse or Drag & Drop Reference Photos';
      }
    }

    // Render previews under upload dropzone
    if (previewsContainer) {
      if (total === 0) {
        previewsContainer.innerHTML = '';
      } else {
        previewsContainer.innerHTML = customUploadedImages.map((img, idx) => `
          <div class="cust-preview-card" data-index="${idx}">
            <div class="cust-preview-thumb-wrap">
              <span class="cust-preview-badge-num">#${idx + 1}</span>
              <img src="${img.dataUrl}" alt="${escapeHtml(img.name)}" class="cust-preview-thumb">
            </div>
            <div class="cust-preview-info">
              <div class="cust-preview-name" title="${escapeHtml(img.name)}">${escapeHtml(img.name)}</div>
              <div class="cust-preview-size">${formatFileSize(img.size)}</div>
              <div class="cust-preview-actions">
                <button type="button" class="btn-replace-img" data-index="${idx}" title="Replace this photo">
                  <i class="fa-solid fa-arrows-rotate"></i> Replace
                </button>
                <button type="button" class="btn-remove-img" data-index="${idx}" title="Remove this photo">
                  <i class="fa-solid fa-trash-can"></i> Remove
                </button>
              </div>
            </div>
          </div>
        `).join('');

        // Wire Replace buttons
        previewsContainer.querySelectorAll('.btn-replace-img').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            activeReplaceIndex = idx;
            if (replaceInput) {
              replaceInput.value = '';
              replaceInput.click();
            }
          });
        });

        // Wire Remove buttons
        previewsContainer.querySelectorAll('.btn-remove-img').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            const removed = customUploadedImages.splice(idx, 1);
            renderCustomImagePreviews();
            showToast(`Photo #${idx + 1} removed.`, 'info');
          });
        });
      }
    }

    // Render Live Customization Summary Photo Strip
    if (previewPhotosCount) {
      previewPhotosCount.textContent = `${total} Photo${total === 1 ? '' : 's'}`;
    }

    if (previewPhotosStrip) {
      if (total === 0) {
        previewPhotosStrip.innerHTML = '<span class="preview-no-photos">No reference photos uploaded yet (Optional)</span>';
      } else {
        previewPhotosStrip.innerHTML = customUploadedImages.map((img, idx) => `
          <img src="${img.dataUrl}" alt="Reference ${idx + 1}" class="preview-photos-thumb" title="Click to enlarge: ${escapeHtml(img.name)}" data-src="${img.dataUrl}" data-name="${escapeHtml(img.name)}">
        `).join('');

        // Click thumbnail in live summary to view in lightbox
        previewPhotosStrip.querySelectorAll('.preview-photos-thumb').forEach(thumb => {
          thumb.addEventListener('click', () => {
            openImageLightbox(thumb.getAttribute('data-src'), thumb.getAttribute('data-name'));
          });
        });
      }
    }
  }

  // Process uploaded files with validation and canvas downscaling
  async function processFiles(filesList) {
    const files = Array.from(filesList);
    if (!files.length) return;

    const remainingSlots = 5 - customUploadedImages.length;
    if (remainingSlots <= 0) {
      showToast('Maximum 5 reference photos already uploaded.', 'warning');
      return;
    }

    if (files.length > remainingSlots) {
      showToast(`Only ${remainingSlots} more photo(s) can be added (Maximum 5).`, 'warning');
    }

    const filesToProcess = files.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      const isImg = file.type.match(/^image\/(jpeg|png|webp|jpg)$/i) || file.name.match(/\.(jpe?g|png|webp)$/i);
      if (!isImg) {
        showToast(`Skipped "${file.name}": Unsupported format. Please upload JPG, JPEG, PNG, or WEBP.`, 'warning');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast(`Skipped "${file.name}": Exceeds 10MB limit.`, 'warning');
        continue;
      }

      try {
        const { dataUrl } = await downscaleImage(file);
        customUploadedImages.push({
          id: 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          name: file.name,
          size: file.size,
          dataUrl
        });
      } catch (err) {
        console.error('Error processing reference image:', err);
        showToast(`Failed to process "${file.name}".`, 'warning');
      }
    }

    renderCustomImagePreviews();
  }

  // Dropzone Click & Keyboard trigger
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => {
      if (customUploadedImages.length >= 5) {
        showToast('Maximum 5 reference photos reached.', 'info');
        return;
      }
      fileInput.click();
    });

    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (customUploadedImages.length < 5) fileInput.click();
      }
    });

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(eventType => {
      dropzone.addEventListener(eventType, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (customUploadedImages.length < 5) {
          dropzone.classList.add('dragover');
        }
      });
    });

    ['dragleave', 'drop'].forEach(eventType => {
      dropzone.addEventListener(eventType, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length) {
        processFiles(dt.files);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length) {
        processFiles(e.target.files);
        fileInput.value = '';
      }
    });
  }

  // Replace Single Image Listener
  if (replaceInput) {
    replaceInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file || activeReplaceIndex === null || activeReplaceIndex >= customUploadedImages.length) return;

      const isImg = file.type.match(/^image\/(jpeg|png|webp|jpg)$/i) || file.name.match(/\.(jpe?g|png|webp)$/i);
      if (!isImg) {
        showToast('Please select a valid image file (JPG, JPEG, PNG, or WEBP).', 'warning');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image size exceeds 10MB limit.', 'warning');
        return;
      }

      try {
        const { dataUrl } = await downscaleImage(file);
        customUploadedImages[activeReplaceIndex] = {
          id: 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          name: file.name,
          size: file.size,
          dataUrl
        };
        renderCustomImagePreviews();
        showToast(`Photo #${activeReplaceIndex + 1} replaced successfully!`, 'success');
      } catch (err) {
        console.error('Error replacing image:', err);
        showToast('Failed to replace image.', 'warning');
      }
      activeReplaceIndex = null;
      replaceInput.value = '';
    });
  }

  // Real-time error clearing as user types
  if (nameInput) nameInput.addEventListener('input', () => clearFieldError(nameInput, 'custNameError'));
  if (phoneInput) phoneInput.addEventListener('input', () => clearFieldError(phoneInput, 'custPhoneError'));
  if (productSelect) productSelect.addEventListener('change', () => clearFieldError(productSelect, 'custProductTypeError'));
  if (dateInput) dateInput.addEventListener('change', () => clearFieldError(dateInput, 'custEventDateError'));
  if (customTextInput) customTextInput.addEventListener('input', () => clearFieldError(customTextInput, 'custCustomTextError'));
  if (cityInput) cityInput.addEventListener('input', () => clearFieldError(cityInput, 'custCityError'));
  if (budgetInput) budgetInput.addEventListener('input', () => clearFieldError(budgetInput, 'custBudgetError'));

  // Initial preview render
  renderCustomImagePreviews();

  // 11. Custom Order Form Validation & Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstErrorEl = null;

      // Validate name
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'custNameError');
        isValid = false;
        if (!firstErrorEl) firstErrorEl = nameInput;
      } else {
        clearFieldError(nameInput, 'custNameError');
      }

      // Validate phone (at least 10 digits)
      const phoneDigits = phoneInput.value.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 10) {
        showFieldError(phoneInput, 'custPhoneError');
        isValid = false;
        if (!firstErrorEl) firstErrorEl = phoneInput;
      } else {
        clearFieldError(phoneInput, 'custPhoneError');
      }

      // Validate product category
      if (!productSelect.value) {
        showFieldError(productSelect, 'custProductTypeError');
        isValid = false;
        if (!firstErrorEl) firstErrorEl = productSelect;
      } else {
        clearFieldError(productSelect, 'custProductTypeError');
      }

      // Validate occasion date (must be today or future)
      if (!dateInput.value) {
        showFieldError(dateInput, 'custEventDateError');
        isValid = false;
        if (!firstErrorEl) firstErrorEl = dateInput;
      } else {
        const selectedDate = new Date(dateInput.value + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          showFieldError(dateInput, 'custEventDateError');
          const errEl = document.getElementById('custEventDateError');
          if (errEl) errEl.textContent = 'Occasion date cannot be in the past.';
          isValid = false;
          if (!firstErrorEl) firstErrorEl = dateInput;
        } else {
          clearFieldError(dateInput, 'custEventDateError');
        }
      }

      // Validate custom text
      if (!customTextInput.value.trim()) {
        showFieldError(customTextInput, 'custCustomTextError');
        isValid = false;
        if (!firstErrorEl) firstErrorEl = customTextInput;
      } else {
        clearFieldError(customTextInput, 'custCustomTextError');
      }

      // Validate city
      if (!cityInput.value.trim()) {
        showFieldError(cityInput, 'custCityError');
        isValid = false;
        if (!firstErrorEl) firstErrorEl = cityInput;
      } else {
        clearFieldError(cityInput, 'custCityError');
      }

      // Validate Expected Budget (optional; if entered, must be >= 100)
      if (budgetInput && budgetInput.value.trim()) {
        const bVal = Number(budgetInput.value.trim());
        if (isNaN(bVal) || bVal < 100) {
          showFieldError(budgetInput, 'custBudgetError');
          isValid = false;
          if (!firstErrorEl) firstErrorEl = budgetInput;
        } else {
          clearFieldError(budgetInput, 'custBudgetError');
        }
      }

      if (!isValid) {
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorEl.focus();
        }
        showToast('Please correct the highlighted personalization fields.', 'warning');
        return;
      }

      // Build complete custom order object
      const inquiryId = 'BCB-CUST-' + Math.floor(1000 + Math.random() * 9000);
      const budgetFormatted = budgetInput && budgetInput.value.trim() ? `₹${Number(budgetInput.value.trim()).toLocaleString('en-IN')}` : 'Flexible / On Discussion';
      const instructionsFormatted = instructionsInput && instructionsInput.value.trim() ? instructionsInput.value.trim() : 'No special requests specified.';

      const orderData = {
        id: inquiryId,
        type: 'custom',
        title: `${productSelect.value} - "${customTextInput.value.trim()}"`,
        customerName: nameInput.value.trim(),
        customerPhone: phoneInput.value.trim(),
        city: cityInput.value.trim(),
        category: productSelect.value,
        customText: customTextInput.value.trim(),
        quantity: parseInt(qtyInput.value) || 1,
        eventDate: dateInput.value,
        budget: budgetFormatted,
        instructions: instructionsFormatted,
        referenceImages: customUploadedImages.map(img => ({
          id: img.id,
          name: img.name,
          size: img.size,
          dataUrl: img.dataUrl
        })),
        status: 'New Inquiry',
        createdAt: new Date().toISOString()
      };

      // Save order into Admin Storage
      saveAdminOrder(orderData);

      showToast(`Custom order request #${inquiryId} submitted successfully!`, 'success');

      // Open confirmation receipt modal with images and details
      openCustomConfirmationModal(orderData);

      // Reset form and upload state
      form.reset();
      customUploadedImages = [];
      renderCustomImagePreviews();

      if (qtyInput) qtyInput.value = 1;
      if (previewTitle) previewTitle.textContent = 'Your Custom Names Here';
      if (previewName) previewName.textContent = 'Guest Customer';
      if (previewDate) previewDate.textContent = 'To be specified';
      if (previewCity) previewCity.textContent = 'To be specified';
      if (previewBudget) {
        previewBudget.textContent = 'Not specified';
        previewBudget.classList.remove('text-gold');
      }
      if (previewInstructionsBox) previewInstructionsBox.style.display = 'none';
      if (previewInstructions) previewInstructions.textContent = 'Standard craftsmanship';
    });
  }
}

function showFieldError(inputEl, errorId) {
  const group = inputEl.closest('.form-group');
  if (group) group.classList.add('has-error');
  const err = document.getElementById(errorId);
  if (err) err.style.display = 'block';
}

function clearFieldError(inputEl, errorId) {
  const group = inputEl.closest('.form-group');
  if (group) group.classList.remove('has-error');
  const err = document.getElementById(errorId);
  if (err) err.style.display = 'none';
}

/**
 * Show custom order request confirmation dialog with uploaded reference photos
 */
function openCustomConfirmationModal(data) {
  const receiptModal = document.getElementById('receiptModal');
  const backdrop = document.getElementById('receiptModalBackdrop');
  const receiptBox = document.getElementById('receiptBoxDetails');
  const receiptTitle = receiptModal.querySelector('.receipt-title');
  const receiptSub = receiptModal.querySelector('.receipt-sub');
  const closeBtn = document.getElementById('closeReceiptBtn');
  const adminBtn = document.getElementById('receiptViewAdminBtn');

  if (!receiptModal || !backdrop || !receiptBox) return;

  receiptTitle.textContent = 'Custom Order Request Received!';
  receiptSub.textContent = 'Your bespoke inquiry and reference photos have been saved to the Artisan Dashboard.';

  const photos = data.referenceImages || [];

  receiptBox.innerHTML = `
    <div class="receipt-id-row">
      <span>Inquiry Reference:</span>
      <strong>#${data.id}</strong>
    </div>
    <div class="receipt-meta-grid">
      <div><strong>Customer:</strong> ${escapeHtml(data.customerName)}</div>
      <div><strong>WhatsApp:</strong> ${escapeHtml(data.customerPhone)}</div>
      <div><strong>Category:</strong> ${escapeHtml(data.category)}</div>
      <div><strong>Quantity:</strong> ${data.quantity} Unit(s)</div>
      <div><strong>Occasion Date:</strong> ${escapeHtml(data.eventDate)}</div>
      <div><strong>Destination:</strong> ${escapeHtml(data.city)}</div>
    </div>
    <div class="receipt-items-list" style="margin-top: 0.6rem;">
      <div><strong>Custom Inscription:</strong> “${escapeHtml(data.customText)}”</div>
      ${data.color ? `<div><strong>Color Theme:</strong> ${escapeHtml(data.color)}</div>` : ''}
      <div><strong>Expected Budget:</strong> <span class="text-gold" style="font-weight:700;">${escapeHtml(data.budget)}</span></div>
      ${data.instructions && data.instructions !== 'No special requests specified.' ? `
        <div style="margin-top:0.35rem; font-size:0.82rem; color:var(--text-secondary);">
          <strong>Instructions:</strong> “${escapeHtml(data.instructions)}”
        </div>
      ` : ''}
    </div>

    <!-- Uploaded Photos in Receipt -->
    <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-gold); text-align: left;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.45rem;">
        <span style="font-size:0.78rem; font-weight:700; color:var(--primary); text-transform:uppercase;">
          <i class="fa-solid fa-images text-gold"></i> Reference Photos Attached (${photos.length})
        </span>
      </div>
      ${photos.length > 0 ? `
        <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:4px;">
          ${photos.map((p, pIdx) => `
            <img src="${p.dataUrl}" alt="Photo ${pIdx + 1}" style="width:52px; height:52px; border-radius:6px; object-fit:cover; border:1.5px solid var(--gold); cursor:pointer;" title="Click to enlarge: ${escapeHtml(p.name)}" onclick="openImageLightbox('${p.dataUrl}', '${escapeHtml(p.name)}')">
          `).join('')}
        </div>
      ` : `
        <span style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">No reference photos attached.</span>
      `}
    </div>

    <div class="receipt-total-line" style="margin-top:0.85rem;">
      <span>Artisan Status:</span>
      <span class="text-success" style="font-weight:700;">✓ Saved in Admin Dashboard</span>
    </div>
  `;

  if (closeBtn) {
    closeBtn.onclick = () => {
      receiptModal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  if (adminBtn) {
    adminBtn.onclick = () => {
      receiptModal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      const adminPath = window.location.pathname.includes('/categories') ? '../admin/' : 'admin/';
      window.open(adminPath, '_blank');
    };
  }

  if (backdrop) {
    backdrop.onclick = () => {
      receiptModal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  receiptModal.classList.add('open');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ==========================================================================
// ADMIN DASHBOARD STORAGE & MANAGEMENT HELPERS
// ==========================================================================

function getAdminOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_ORDERS);
    if (!raw) return [];
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out legacy dummy seeds so only real customer orders are shown
    parsed = parsed.filter(o => !['BCB-CUST-8429', 'BCB-CUST-7714', 'BCB-OUTFIT-5120', 'BCB-ORD-3204'].includes(o.id));
    return parsed;
  } catch (e) {
    return [];
  }
}

function saveAdminOrder(order) {
  // 1. Send to persistent SQLite Backend API
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).then(res => res.json()).then(res => {
      if (res && res.success) {
        console.log(`Order #${order.id} saved to SQLite database successfully.`);
      }
    }).catch(err => {
      console.warn('Network offline or backend sync notice:', err);
    });
  } catch (err) {
    console.warn('Backend API submission error:', err);
  }

  // 2. Persist to LocalStorage for instant browser availability
  try {
    let orders = getAdminOrders();
    // Prevent duplicate entries
    const existingIdx = orders.findIndex(o => o.id === order.id);
    if (existingIdx !== -1) {
      orders[existingIdx] = order;
    } else {
      orders.unshift(order);
    }
    if (orders.length > 50) orders = orders.slice(0, 50);
    localStorage.setItem(STORAGE_KEY_ADMIN_ORDERS, JSON.stringify(orders));
    updateAdminBadges();
  } catch (e) {
    console.warn('LocalStorage write warning:', e);
  }
}

function updateAdminOrderStatus(orderId, newStatus) {
  // Sync with backend API
  try {
    const token = sessionStorage.getItem('bhami_admin_token') || '';
    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ status: newStatus })
    }).catch(e => console.warn('Could not sync status with server:', e));
  } catch (e) {}

  try {
    let orders = getAdminOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = newStatus;
      localStorage.setItem(STORAGE_KEY_ADMIN_ORDERS, JSON.stringify(orders));
      showToast(`Order #${orderId} status set to "${newStatus}"`, 'success');
      updateAdminBadges();
      return true;
    }
  } catch (e) {
    console.error('Error updating order status:', e);
  }
  return false;
}

function deleteAdminOrder(orderId) {
  // Sync with backend API
  try {
    const token = sessionStorage.getItem('bhami_admin_token') || '';
    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    }).catch(e => console.warn('Could not sync delete with server:', e));
  } catch (e) {}

  try {
    let orders = getAdminOrders();
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEY_ADMIN_ORDERS, JSON.stringify(orders));
    showToast(`Order #${orderId} deleted from dashboard.`, 'info');
    updateAdminBadges();
    return true;
  } catch (e) {
    console.error('Error deleting order:', e);
  }
  return false;
}

function seedDefaultAdminOrders() {
  // Real orders only - no dummy data
  return [];
}

function updateAdminBadges() {
  const orders = getAdminOrders();
  const count = orders.length;
  const adminBadge = document.getElementById('adminBadgeCount');
  const mobileAdminBadge = document.getElementById('mobileAdminBadgeCount');
  if (adminBadge) adminBadge.textContent = count;
  if (mobileAdminBadge) mobileAdminBadge.textContent = count;

  const allCount = document.getElementById('adminTabCountAll');
  const customCount = document.getElementById('adminTabCountCustom');
  const outfitCount = document.getElementById('adminTabCountOutfit');
  const checkoutCount = document.getElementById('adminTabCountCheckout');

  if (allCount) allCount.textContent = count;
  if (customCount) customCount.textContent = orders.filter(o => o.type === 'custom').length;
  if (outfitCount) outfitCount.textContent = orders.filter(o => o.type === 'outfit').length;
  if (checkoutCount) checkoutCount.textContent = orders.filter(o => o.type === 'checkout').length;
}

/**
 * Setup and Manage Admin Orders Dashboard Modal
 */
function setupAdminDashboard() {
  const modal = document.getElementById('adminDashboardModal');
  const backdrop = document.getElementById('adminDashboardBackdrop');
  const openBtn = document.getElementById('adminDashboardBtn');
  const mobileLink = document.getElementById('mobileAdminLink');
  const closeBtn = document.getElementById('closeAdminDashboardBtn');
  const ordersBody = document.getElementById('adminOrdersBody');
  const searchInput = document.getElementById('adminSearchInput');
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const exportBtn = document.getElementById('adminExportJsonBtn');
  const resetBtn = document.getElementById('adminResetDemoBtn');

  let currentFilter = 'all';
  let searchQuery = '';

  function openDashboard() {
    if (!modal || !backdrop) return;
    renderOrders();
    updateAdminBadges();
    modal.classList.add('open');
    backdrop.classList.add('active');
    document.body.classList.add('modal-open-lock');
    closeMobileMenu();
  }

  function closeDashboard() {
    if (!modal || !backdrop) return;
    modal.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.classList.remove('modal-open-lock');
  }

  const navigateToAdmin = () => {
    const adminPath = window.location.pathname.includes('/categories') ? '../admin/' : 'admin/';
    window.location.href = adminPath;
  };

  if (openBtn) openBtn.onclick = navigateToAdmin;
  if (mobileLink) {
    mobileLink.onclick = (e) => {
      e.preventDefault();
      navigateToAdmin();
    };
  }
  if (closeBtn) closeBtn.onclick = closeDashboard;
  if (backdrop) backdrop.onclick = closeDashboard;

  // Filter tabs
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderOrders();
    };
  });

  // Search input
  if (searchInput) {
    searchInput.oninput = () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderOrders();
    };
  }

  // Export JSON
  if (exportBtn) {
    exportBtn.onclick = () => {
      const orders = getAdminOrders();
      const blob = new Blob([JSON.stringify(orders, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bhami_craft_orders_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Orders exported successfully as JSON file.', 'success');
    };
  }

  // Reset Demo Orders
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Reset orders to sample demo requests? This will restore realistic demo inquiries.')) {
        seedDefaultAdminOrders();
        renderOrders();
        updateAdminBadges();
        showToast('Admin orders reset to default demo inquiries.', 'info');
      }
    };
  }

  function renderOrders() {
    if (!ordersBody) return;
    const allOrders = getAdminOrders();

    // Filter by tab
    let filtered = allOrders;
    if (currentFilter !== 'all') {
      filtered = filtered.filter(o => o.type === currentFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(o => {
        const text = [
          o.id,
          o.customerName,
          o.customerPhone,
          o.city,
          o.category,
          o.customText,
          o.instructions,
          o.status
        ].filter(Boolean).join(' ').toLowerCase();
        return text.includes(searchQuery);
      });
    }

    if (filtered.length === 0) {
      ordersBody.innerHTML = `
        <div class="admin-empty-state">
          <i class="fa-solid fa-inbox"></i>
          <h4>No matching orders found</h4>
          <p>${searchQuery ? `No orders matched query "${escapeHtml(searchQuery)}". Try clearing your search.` : 'No custom orders or inquiries have been placed in this category yet.'}</p>
          ${searchQuery ? `<button type="button" class="btn btn-gold btn-sm" id="clearSearchAdminBtn">Clear Search</button>` : ''}
        </div>
      `;
      const clrBtn = document.getElementById('clearSearchAdminBtn');
      if (clrBtn) {
        clrBtn.onclick = () => {
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          renderOrders();
        };
      }
      return;
    }

    ordersBody.innerHTML = filtered.map(order => {
      const isCustom = order.type === 'custom';
      const isOutfit = order.type === 'outfit';
      const badgeClass = isCustom ? 'badge-custom' : (isOutfit ? 'badge-outfit' : 'badge-cart');
      const badgeText = isCustom ? 'Custom Personalization' : (isOutfit ? 'Outfit Studio' : 'Catalogue Cart');
      const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Recently';

      const phoneDigits = order.customerPhone ? String(order.customerPhone).replace(/[^0-9]/g, '') : '';
      const waMsg = encodeURIComponent(`Namaste ${order.customerName}! Thank you for your inquiry #${order.id} with Bhami Craft Boutique for "${order.category}". We are reviewing your customization requirements.`);
      const waLink = `https://wa.me/91${phoneDigits}?text=${waMsg}`;

      const photos = order.referenceImages || [];

      return `
        <div class="admin-order-card" data-id="${order.id}">
          <div class="admin-order-card-header">
            <div class="admin-order-id-group">
              <span class="admin-order-ref">#${escapeHtml(order.id)}</span>
              <span class="admin-order-badge ${badgeClass}">${badgeText}</span>
              <span class="admin-order-time"><i class="fa-regular fa-clock"></i> ${formattedDate}</span>
            </div>
            <div class="admin-status-control">
              <label for="status_${order.id}" style="font-size:0.75rem; font-weight:600; color:var(--text-muted);">Status:</label>
              <select id="status_${order.id}" class="admin-status-select" data-id="${order.id}">
                ${['New Inquiry', 'Under Review', 'Approved', 'In Production', 'Dispatched', 'Completed', 'Cancelled'].map(st => `
                  <option value="${st}" ${order.status === st ? 'selected' : ''}>${st}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="admin-order-card-content">
            <!-- Customer Bar -->
            <div class="admin-customer-info-bar">
              <div class="info-item">
                <i class="fa-solid fa-user"></i>
                <strong>${escapeHtml(order.customerName)}</strong>
              </div>
              <div class="info-item">
                <i class="fa-solid fa-phone"></i>
                <span>${escapeHtml(order.customerPhone)}</span>
                ${phoneDigits.length >= 10 ? `
                  <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="admin-wa-link" title="Open direct WhatsApp chat with customer">
                    <i class="fa-brands fa-whatsapp"></i> Chat WhatsApp
                  </a>
                ` : ''}
              </div>
              <div class="info-item">
                <i class="fa-solid fa-location-dot"></i>
                <span>${escapeHtml(order.city || 'Not specified')}</span>
              </div>
            </div>

            <!-- Specs Grid -->
            <div class="admin-order-specs-grid">
              <div class="admin-spec-box">
                <span class="spec-label">Product / Category</span>
                <span class="spec-val">${escapeHtml(order.category || order.title)}</span>
              </div>
              <div class="admin-spec-box">
                <span class="spec-label">Custom Inscription / Text</span>
                <span class="spec-val">${escapeHtml(order.customText || 'None')}</span>
              </div>
              <div class="admin-spec-box">
                <span class="spec-label">Occasion Date</span>
                <span class="spec-val">${order.eventDate ? escapeHtml(order.eventDate) : 'Not specified'}</span>
              </div>
              <div class="admin-spec-box">
                <span class="spec-label">Quantity</span>
                <span class="spec-val">${order.quantity || 1} Unit(s)</span>
              </div>
              ${order.color ? `
                <div class="admin-spec-box">
                  <span class="spec-label">Color Theme</span>
                  <span class="spec-val">${escapeHtml(order.color)}</span>
                </div>
              ` : ''}
              <div class="admin-spec-box highlight-budget">
                <span class="spec-label">Expected Budget</span>
                <span class="spec-val">${escapeHtml(order.budget || 'Flexible')}</span>
              </div>
            </div>

            <!-- Instructions -->
            ${order.instructions && order.instructions !== 'No specific instructions provided.' && order.instructions !== 'No special requests specified.' ? `
              <div class="admin-instructions-display">
                <strong><i class="fa-solid fa-comment-dots text-gold"></i> Customer Instructions:</strong>
                “${escapeHtml(order.instructions)}”
              </div>
            ` : ''}

            <!-- Reference Photos Gallery -->
            <div class="admin-photos-section">
              <div class="admin-photos-header">
                <h5><i class="fa-solid fa-images text-gold"></i> Uploaded Reference Photos</h5>
                <span class="admin-photos-count-tag">${photos.length} Photo${photos.length === 1 ? '' : 's'} Attached</span>
              </div>

              ${photos.length > 0 ? `
                <div class="admin-photos-grid">
                  ${photos.map((photo, pIdx) => `
                    <div class="admin-photo-card" data-src="${photo.dataUrl}" data-name="${escapeHtml(photo.name || `Photo #${pIdx + 1}`)}" title="Click to enlarge ${escapeHtml(photo.name)}">
                      <img src="${photo.dataUrl}" alt="${escapeHtml(photo.name || 'Reference')}" class="admin-photo-thumb" loading="lazy">
                      <div class="admin-photo-overlay">
                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                        <span>Enlarge</span>
                      </div>
                      <div class="admin-photo-caption">${escapeHtml(photo.name || `Photo #${pIdx + 1}`)}</div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="admin-no-photos-msg">
                  <i class="fa-regular fa-image"></i>
                  <span>No reference photos attached for this inquiry (Standard craftsmanship requested).</span>
                </div>
              `}
            </div>

            <!-- Card Actions -->
            <div class="admin-order-actions-bar">
              <button type="button" class="btn-delete-order" data-id="${order.id}">
                <i class="fa-solid fa-trash"></i> Delete Order
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Wire Status Selects
    ordersBody.querySelectorAll('.admin-status-select').forEach(sel => {
      sel.onchange = () => {
        const id = sel.getAttribute('data-id');
        const newSt = sel.value;
        updateAdminOrderStatus(id, newSt);
      };
    });

    // Wire Delete buttons
    ordersBody.querySelectorAll('.btn-delete-order').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete order #${id}?`)) {
          deleteAdminOrder(id);
          renderOrders();
        }
      };
    });

    // Wire Image Enlarge click
    ordersBody.querySelectorAll('.admin-photo-card').forEach(card => {
      card.onclick = () => {
        const src = card.getAttribute('data-src');
        const name = card.getAttribute('data-name');
        openImageLightbox(src, name);
      };
    });
  }
}

/**
 * Image Lightbox Modal Functions
 */
function openImageLightbox(src, caption) {
  const modal = document.getElementById('imageLightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const dims = document.getElementById('lightboxDimensions');

  if (!modal || !img) return;

  img.src = src;
  if (cap) cap.textContent = caption || 'Reference Photo Preview';
  if (dims) dims.textContent = '';

  img.onload = () => {
    if (dims) dims.textContent = `${img.naturalWidth} × ${img.naturalHeight}px`;
  };

  modal.classList.add('open');
}

function closeImageLightbox() {
  const modal = document.getElementById('imageLightboxModal');
  if (modal) modal.classList.remove('open');
}

function setupImageLightbox() {
  const modal = document.getElementById('imageLightboxModal');
  const closeBtn = document.getElementById('closeImageLightboxBtn');
  const backdrop = document.getElementById('imageLightboxBackdrop');

  if (closeBtn) closeBtn.onclick = closeImageLightbox;
  if (backdrop) backdrop.onclick = closeImageLightbox;
}

// ==========================================================================
// 6B. OUTFIT CUSTOMIZATION STUDIO & TAILORING BUILDER
// ==========================================================================

function setupOutfitCustomizationStudio() {
  const form = document.getElementById('outfitCustomizationForm');
  const nameInput = document.getElementById('outfitCustName');
  const phoneInput = document.getElementById('outfitCustPhone');
  const typeSelect = document.getElementById('outfitTypeSelect');
  const cityInput = document.getElementById('outfitDeliveryCity');
  const neckSelect = document.getElementById('outfitNeckDesign');
  const sleeveSelect = document.getElementById('outfitSleeveDesign');
  const fabricSelect = document.getElementById('outfitFabricSelect');
  const instructionsInput = document.getElementById('outfitInstructions');

  // Preview elements
  const previewTitle = document.getElementById('outfitPreviewTitle');
  const previewType = document.getElementById('outfitPreviewType');
  const previewFit = document.getElementById('outfitPreviewFit');
  const previewNeck = document.getElementById('outfitPreviewNeck');
  const previewSleeve = document.getElementById('outfitPreviewSleeve');
  const previewFabric = document.getElementById('outfitPreviewFabric');
  const livePlate = document.querySelector('.outfit-live-plate');

  // Measurements panel & fields
  const customMeasPanel = document.getElementById('customMeasurementsPanel');
  const measBust = document.getElementById('measBust');
  const measWaist = document.getElementById('measWaist');
  const measHip = document.getElementById('measHip');
  const measLength = document.getElementById('measLength');
  const measShoulder = document.getElementById('measShoulder');
  const measArmhole = document.getElementById('measArmhole');

  // Image Upload elements
  const uploadBox = document.getElementById('outfitUploadBox');
  const fileInput = document.getElementById('outfitRefImageInput');
  const dropContent = document.getElementById('uploadDropContent');
  const previewWrapper = document.getElementById('uploadPreviewWrapper');
  const imgThumb = document.getElementById('uploadImgThumb');
  const fileNameEl = document.getElementById('uploadFileName');
  const fileSizeEl = document.getElementById('uploadFileSize');
  const removeUploadBtn = document.getElementById('removeUploadBtn');
  const previewThumbBox = document.getElementById('outfitPreviewThumbBox');
  const previewThumbImg = document.getElementById('outfitPreviewThumbImg');
  const refPreviewRow = document.getElementById('outfitRefPreviewRow');

  let uploadedFileDetails = null;

  // 1. "Customize Your Outfit" buttons on sample cards
  document.querySelectorAll('.trigger-outfit-customise').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const outfitType = btn.getAttribute('data-outfit');
      if (typeSelect && outfitType) {
        typeSelect.value = outfitType;
        typeSelect.dispatchEvent(new Event('change'));
      }
      const studio = document.getElementById('outfitCustomizationStudio');
      if (studio) {
        studio.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Configuring ${outfitType} in studio!`, 'info');
    });
  });

  // 2. Outfit Type Change
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      const val = typeSelect.value;
      if (previewType) previewType.textContent = `Category: ${val}`;
      if (previewTitle) {
        if (val === 'Customized Kurtis') previewTitle.textContent = 'Paithani Motif Silk Kurti';
        else if (val === 'Customized Blouses' || val === 'Blouses') previewTitle.textContent = 'Royal Bridal Zardozi Blouse';
        else if (val === 'Traditional ethnic outfits') previewTitle.textContent = 'Nauvari & Paithani Ensemble';
        else if (val === 'Custom stitching orders') previewTitle.textContent = 'Bespoke Stitched Kurta Set';
        else previewTitle.textContent = val;
      }
      clearFieldError(typeSelect, 'outfitTypeError');
    });
  }

  // 3. Size Pills Selection
  const sizePills = document.querySelectorAll('#outfitSizePills .size-pill');
  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const sizeVal = radio ? radio.value : '';
      if (sizeVal === 'Custom Measurements') {
        if (customMeasPanel) customMeasPanel.style.display = 'block';
        updateMeasurementPreview();
      } else {
        if (customMeasPanel) customMeasPanel.style.display = 'none';
        if (previewFit) previewFit.textContent = `Standard ${sizeVal}`;
      }
    });
  });

  // 4. Custom Measurements Input Listeners
  [measBust, measWaist, measHip, measLength, measShoulder, measArmhole].forEach(input => {
    if (input) {
      input.addEventListener('input', updateMeasurementPreview);
    }
  });

  function updateMeasurementPreview() {
    if (!previewFit) return;
    const isCustom = document.querySelector('input[name="outfitSize"]:checked')?.value === 'Custom Measurements';
    if (!isCustom) return;

    const parts = [];
    if (measBust && measBust.value) parts.push(`B:${measBust.value}"`);
    if (measWaist && measWaist.value) parts.push(`W:${measWaist.value}"`);
    if (measHip && measHip.value) parts.push(`H:${measHip.value}"`);
    if (measLength && measLength.value) parts.push(`L:${measLength.value}"`);

    if (parts.length > 0) {
      previewFit.textContent = `Custom (${parts.join(', ')})`;
    } else {
      previewFit.textContent = 'Custom Made-to-Measure';
    }
  }

  // 5. Neckline, Sleeve, Fabric Dropdowns
  if (neckSelect && previewNeck) {
    neckSelect.addEventListener('change', () => {
      previewNeck.textContent = neckSelect.value;
    });
  }
  if (sleeveSelect && previewSleeve) {
    sleeveSelect.addEventListener('change', () => {
      previewSleeve.textContent = sleeveSelect.value;
    });
  }
  if (fabricSelect && previewFabric) {
    fabricSelect.addEventListener('change', () => {
      previewFabric.textContent = fabricSelect.value;
    });
  }

  // 7. Optional Reference Image Upload (Client-side FileReader only)
  if (uploadBox && fileInput) {
    uploadBox.addEventListener('click', (e) => {
      if (e.target.closest('#removeUploadBtn')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, or WEBP).', 'warning');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit.', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const dataUrl = evt.target.result;
        uploadedFileDetails = {
          name: file.name,
          size: Math.round(file.size / 1024) + ' KB',
          dataUrl: dataUrl
        };

        if (imgThumb) imgThumb.src = dataUrl;
        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileSizeEl) fileSizeEl.textContent = uploadedFileDetails.size;

        if (dropContent) dropContent.style.display = 'none';
        if (previewWrapper) previewWrapper.style.display = 'flex';

        if (refPreviewRow) refPreviewRow.style.display = 'flex';
        if (previewThumbBox) previewThumbBox.style.display = 'flex';
        if (previewThumbImg) previewThumbImg.src = dataUrl;

        showToast('Reference design loaded in preview!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeUploadBtn) {
    removeUploadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fileInput) fileInput.value = '';
      uploadedFileDetails = null;

      if (dropContent) dropContent.style.display = 'block';
      if (previewWrapper) previewWrapper.style.display = 'none';

      if (refPreviewRow) refPreviewRow.style.display = 'none';
      if (previewThumbBox) previewThumbBox.style.display = 'none';
      showToast('Reference image removed.', 'info');
    });
  }

  // 8. Outfit Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'outfitCustNameError');
        isValid = false;
      } else {
        clearFieldError(nameInput, 'outfitCustNameError');
      }

      // Validate phone
      const phoneDigits = phoneInput.value.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 10) {
        showFieldError(phoneInput, 'outfitCustPhoneError');
        isValid = false;
      } else {
        clearFieldError(phoneInput, 'outfitCustPhoneError');
      }

      // Validate outfit type
      if (!typeSelect.value) {
        showFieldError(typeSelect, 'outfitTypeError');
        isValid = false;
      } else {
        clearFieldError(typeSelect, 'outfitTypeError');
      }

      // Validate city
      if (!cityInput.value.trim()) {
        showFieldError(cityInput, 'outfitCityError');
        isValid = false;
      } else {
        clearFieldError(cityInput, 'outfitCityError');
      }

      if (!isValid) {
        showToast('Please fill in the required outfit customization fields.', 'warning');
        return;
      }

      // Determine Size String
      const chosenSizeRadio = document.querySelector('input[name="outfitSize"]:checked')?.value || 'M (Bust 38)';
      let sizeFitSummary = chosenSizeRadio;
      if (chosenSizeRadio === 'Custom Measurements') {
        const parts = [];
        if (measBust && measBust.value) parts.push(`Bust: ${measBust.value}"`);
        if (measWaist && measWaist.value) parts.push(`Waist: ${measWaist.value}"`);
        if (measHip && measHip.value) parts.push(`Hip: ${measHip.value}"`);
        if (measLength && measLength.value) parts.push(`Length: ${measLength.value}"`);
        if (measShoulder && measShoulder.value) parts.push(`Shoulder: ${measShoulder.value}"`);
        if (measArmhole && measArmhole.value) parts.push(`Armhole: ${measArmhole.value}"`);
        sizeFitSummary = parts.length > 0 ? `Custom (${parts.join(', ')})` : 'Custom Measurements (Details on WhatsApp)';
      }

      // Demo Starting Price
      let startingPrice = '₹1,850 (Demo Price)';
      if (typeSelect.value === 'Customized Blouses' || typeSelect.value === 'Blouses') startingPrice = '₹2,450 (Demo Price)';
      if (typeSelect.value === 'Traditional ethnic outfits') startingPrice = '₹4,999 (Demo Price)';
      if (typeSelect.value === 'Custom stitching orders') startingPrice = '₹1,200 (Demo Price)';

      const inquiryId = 'BCB-OUTFIT-' + Math.floor(1000 + Math.random() * 9000);

      // Open Outfit Confirmation Modal
      openOutfitConfirmationModal({
        inquiryId,
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim(),
        outfitType: typeSelect.value,
        sizeFit: sizeFitSummary,
        neck: neckSelect ? neckSelect.value : 'Standard',
        sleeve: sleeveSelect ? sleeveSelect.value : 'Standard',
        fabric: fabricSelect ? fabricSelect.value : 'Pure Silk',
        hasImage: !!uploadedFileDetails,
        fileName: uploadedFileDetails ? uploadedFileDetails.name : '',
        fileThumb: uploadedFileDetails ? uploadedFileDetails.dataUrl : '',
        instructions: instructionsInput ? instructionsInput.value.trim() : '',
        startingPrice: startingPrice
      });

      showToast(`Outfit Customization Request #${inquiryId} submitted!`, 'success');

      // Reset Form and previews
      form.reset();
      if (fileInput) fileInput.value = '';
      uploadedFileDetails = null;
      if (dropContent) dropContent.style.display = 'block';
      if (previewWrapper) previewWrapper.style.display = 'none';
      if (refPreviewRow) refPreviewRow.style.display = 'none';
      if (previewThumbBox) previewThumbBox.style.display = 'none';
      if (customMeasPanel) customMeasPanel.style.display = 'none';

      // Reset Size Pills active state to M
      sizePills.forEach(p => p.classList.remove('active'));
      const defaultPill = document.querySelector('input[value="M (Bust 38)"]')?.closest('.size-pill');
      if (defaultPill) defaultPill.classList.add('active');

      // Reset live plate texts
      if (previewTitle) previewTitle.textContent = 'Paithani Motif Silk Kurti';
      if (previewType) previewType.textContent = 'Category: Customized Kurtis';
      if (previewFit) previewFit.textContent = 'Standard M (Bust 38)';
      if (livePlate) livePlate.style.background = 'radial-gradient(circle, #8A2534 0%, #741F2B 65%, #50131B 100%)';
    });
  }
}

/**
 * Open outfit customization demo confirmation modal
 */
function openOutfitConfirmationModal(data) {
  const modal = document.getElementById('outfitReceiptModal');
  const backdrop = document.getElementById('outfitReceiptModalBackdrop');
  const detailsBox = document.getElementById('outfitReceiptBoxDetails');
  const closeBtn = document.getElementById('closeOutfitReceiptBtn');

  if (!modal || !backdrop || !detailsBox) return;

  const dispatchDate = new Date();
  dispatchDate.setDate(dispatchDate.getDate() + 5);
  const formattedDispatch = dispatchDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  detailsBox.innerHTML = `
    <div class="receipt-id-row">
      <span>Tailoring Inquiry Reference:</span>
      <strong>#${data.inquiryId}</strong>
    </div>
    <div class="receipt-meta-grid">
      <div><strong>Customer:</strong> ${escapeHtml(data.name)}</div>
      <div><strong>WhatsApp:</strong> ${escapeHtml(data.phone)}</div>
      <div><strong>Outfit Type:</strong> ${escapeHtml(data.outfitType)}</div>
      <div><strong>Size / Fit:</strong> ${escapeHtml(data.sizeFit)}</div>
      <div><strong>Destination:</strong> ${escapeHtml(data.city)}</div>
      <div><strong>Est. Stitch Time:</strong> 4–5 Days (${formattedDispatch})</div>
    </div>
    <div class="receipt-items-list">
      ${data.color ? `<div><strong>Color Theme:</strong> ${escapeHtml(data.color)}</div>` : ''}
      <div><strong>Neckline Design:</strong> ${escapeHtml(data.neck)}</div>
      <div><strong>Sleeve Style:</strong> ${escapeHtml(data.sleeve)}</div>
      <div><strong>Fabric Choice:</strong> ${escapeHtml(data.fabric)}</div>
      ${data.hasImage ? `
        <div style="display:flex; align-items:center; gap:0.65rem; margin-top:0.35rem; color:#2B7A48;">
          <img src="${data.fileThumb}" style="width:36px; height:36px; border-radius:4px; object-fit:cover; border:1px solid #D5AD58;">
          <span><strong>Reference Design Photo:</strong> Attached (${escapeHtml(data.fileName)})</span>
        </div>
      ` : ''}
      ${data.instructions ? `<div style="margin-top:0.3rem;"><strong>Special Instructions:</strong> “${escapeHtml(data.instructions)}”</div>` : ''}
    </div>
    <div class="receipt-total-line">
      <span>Estimated Starting Price:</span>
      <span>${data.startingPrice}</span>
    </div>
    <p style="font-size:0.75rem; color:#876E65; margin-top:0.6rem; text-align:center;">
      <i class="fa-solid fa-circle-check text-success"></i> Demonstration mode: No payment processed. Our master tailor will contact you on WhatsApp!
    </p>
  `;

  const outfitAdminBtn = document.getElementById('outfitReceiptViewAdminBtn');
  if (outfitAdminBtn) {
    outfitAdminBtn.onclick = () => {
      modal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      const adminPath = window.location.pathname.includes('/categories') ? '../admin/' : 'admin/';
      window.open(adminPath, '_blank');
    };
  }

  // Save outfit custom order to Admin Dashboard
  saveAdminOrder({
    id: data.inquiryId,
    type: 'outfit',
    title: `${data.outfitType} (${data.sizeFit})`,
    customerName: data.name,
    customerPhone: data.phone,
    city: data.city,
    category: data.outfitType,
    customText: `Neck: ${data.neck} | Sleeve: ${data.sleeve}`,
    color: data.color || '',
    quantity: 1,
    eventDate: formattedDispatch,
    budget: data.startingPrice,
    instructions: `Neck: ${data.neck}, Sleeve: ${data.sleeve}, Fabric: ${data.fabric}. ${data.instructions || ''}`,
    status: 'New Inquiry',
    createdAt: new Date().toISOString(),
    referenceImages: data.hasImage && data.fileThumb ? [{
      id: 'outfit_img_' + Date.now(),
      name: data.fileName,
      size: 102400,
      dataUrl: data.fileThumb
    }] : []
  });

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  if (backdrop) {
    backdrop.onclick = () => {
      modal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  modal.classList.add('open');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ==========================================================================
// 7. DEMO CHECKOUT & ORDER RECEIPT
// ==========================================================================

function setupDemoCheckout() {
  const proceedBtn = document.getElementById('proceedToCheckoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const backdrop = document.getElementById('checkoutModalBackdrop');
  const closeBtn = document.getElementById('closeCheckoutModal');
  const checkoutForm = document.getElementById('demoCheckoutForm');

  // Summary elements
  const summaryItemsContainer = document.getElementById('checkoutSummaryItems');
  const chkSubtotalEl = document.getElementById('chkSubtotal');
  const chkDiscountRow = document.getElementById('chkDiscountRow');
  const chkDiscountEl = document.getElementById('chkDiscount');
  const chkGrandTotalEl = document.getElementById('chkGrandTotal');
  const chkOrderTotalBtn = document.getElementById('chkOrderTotalBtn');

  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      if (STATE.cart.length === 0) {
        showToast('Your shopping bag is empty.', 'warning');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCheckoutModal);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeCheckoutModal);
  }

  // Payment method selection cards
  const paymentCards = document.querySelectorAll('.payment-method-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  function openCheckoutModal() {
    if (!checkoutModal || !backdrop) return;

    const { subtotal, discount, grandTotal } = calculateCartTotals();

    // Populate order summary
    if (summaryItemsContainer) {
      summaryItemsContainer.innerHTML = STATE.cart.map(item => `
        <div class="chk-summary-item">
          <span class="chk-summary-name">${escapeHtml(item.name)} x ${item.quantity}</span>
          <strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong>
        </div>
      `).join('');
    }

    if (chkSubtotalEl) chkSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (chkDiscountRow && chkDiscountEl) {
      if (discount > 0) {
        chkDiscountRow.style.display = 'flex';
        chkDiscountEl.textContent = `- ₹${discount.toLocaleString('en-IN')}`;
      } else {
        chkDiscountRow.style.display = 'none';
      }
    }
    if (chkGrandTotalEl) chkGrandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    if (chkOrderTotalBtn) chkOrderTotalBtn.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    checkoutModal.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    if (checkoutModal && backdrop) {
      checkoutModal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Submit checkout form
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('chkName').value.trim();
      const phone = document.getElementById('chkPhone').value.trim();
      const address = document.getElementById('chkAddress').value.trim();
      const city = document.getElementById('chkCity').value.trim();
      const pincode = document.getElementById('chkPincode').value.trim();
      const paymentMethod = document.querySelector('input[name="demoPayment"]:checked')?.value || 'UPI';

      if (!name || !phone || !address || !city || !pincode) {
        showToast('Please provide your complete delivery address.', 'warning');
        return;
      }

      const orderId = 'BCB-ORD-' + Math.floor(10000 + Math.random() * 90000);
      const { grandTotal } = calculateCartTotals();
      const placedCartSnapshot = [...STATE.cart];

      // Close checkout modal
      closeCheckoutModal();

      // Clear cart
      STATE.cart = [];
      STATE.appliedCoupon = null;
      saveCartToStorage();
      updateCartUI();

      // Open receipt modal
      openReceiptModal({
        orderId,
        name,
        phone,
        address,
        city,
        pincode,
        paymentMethod: paymentMethod.toUpperCase(),
        total: grandTotal,
        items: placedCartSnapshot
      });
    });
  }
}

/**
 * Open demo order confirmation receipt modal
 */
function openReceiptModal(orderData) {
  const modal = document.getElementById('receiptModal');
  const backdrop = document.getElementById('receiptModalBackdrop');
  const detailsBox = document.getElementById('receiptBoxDetails');
  const closeBtn = document.getElementById('closeReceiptBtn');
  const receiptTitle = modal.querySelector('.receipt-title');
  const receiptSub = modal.querySelector('.receipt-sub');

  if (!modal || !backdrop || !detailsBox) return;

  receiptTitle.textContent = 'Demo Order Placed Successfully!';
  receiptSub.textContent = 'Thank you for testing Bhami Craft Boutique. Your simulated order details:';

  const dispatchDate = new Date();
  dispatchDate.setDate(dispatchDate.getDate() + 3);
  const formattedDispatch = dispatchDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  detailsBox.innerHTML = `
    <div class="receipt-id-row">
      <span>Order ID:</span>
      <strong>#${orderData.orderId}</strong>
    </div>
    <div class="receipt-meta-grid">
      <div><strong>Customer:</strong> ${escapeHtml(orderData.name)}</div>
      <div><strong>Contact:</strong> ${escapeHtml(orderData.phone)}</div>
      <div><strong>Payment:</strong> Simulated (${escapeHtml(orderData.paymentMethod)})</div>
      <div><strong>Est. Dispatch:</strong> ${formattedDispatch}</div>
    </div>
    <div style="font-size:0.82rem; margin-bottom:0.75rem; color:#5E463E;">
      <strong>Delivery Destination:</strong> ${escapeHtml(orderData.address)}, ${escapeHtml(orderData.city)} - ${escapeHtml(orderData.pincode)}
    </div>
    <div class="receipt-items-list">
      <strong>Items in this Order (${orderData.items.length}):</strong>
      ${orderData.items.map(item => `
        <div style="display:flex; justify-content:space-between;">
          <span>• ${escapeHtml(item.name)} (x${item.quantity})</span>
          <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
        </div>
      `).join('')}
    </div>
    <div class="receipt-total-line">
      <span>Total Paid (Simulated):</span>
      <span>₹${orderData.total.toLocaleString('en-IN')}</span>
    </div>
  `;

  const receiptAdminBtn = document.getElementById('receiptViewAdminBtn');
  if (receiptAdminBtn) {
    receiptAdminBtn.onclick = () => {
      modal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      const adminPath = window.location.pathname.includes('/categories') ? '../admin/' : 'admin/';
      window.open(adminPath, '_blank');
    };
  }

  // Save checkout purchase order to Admin Dashboard
  saveAdminOrder({
    id: orderData.orderId,
    type: 'checkout',
    title: `Bag Purchase (${orderData.items.length} items)`,
    customerName: orderData.name,
    customerPhone: orderData.phone,
    city: `${orderData.city} - ${orderData.pincode}`,
    category: 'Catalogue Direct Order',
    customText: orderData.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
    color: 'Selected Catalogue Variants',
    quantity: orderData.items.reduce((s, i) => s + i.quantity, 0),
    eventDate: formattedDispatch,
    budget: `₹${orderData.total.toLocaleString('en-IN')}`,
    instructions: `Delivery to ${orderData.address}, ${orderData.city}. Payment: ${orderData.paymentMethod}.`,
    status: 'New Inquiry',
    createdAt: new Date().toISOString(),
    referenceImages: []
  });

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  if (backdrop) {
    backdrop.onclick = () => {
      modal.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  modal.classList.add('open');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ==========================================================================
// 8. COUPON CODES, WISHLIST, SEARCH & FILTERS
// ==========================================================================

function setupCoupons() {
  const couponInput = document.getElementById('couponCodeInput');
  const applyBtn = document.getElementById('applyCouponBtn');
  const statusMsg = document.getElementById('couponStatusMessage');

  if (!applyBtn || !couponInput || !statusMsg) return;

  applyBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (!code) {
      statusMsg.textContent = 'Please enter a coupon code.';
      statusMsg.className = 'coupon-status error';
      return;
    }

    if (code === 'BHAMI10') {
      STATE.appliedCoupon = { code: 'BHAMI10', discountPercent: 10 };
      statusMsg.textContent = '✓ 10% Boutique Discount Applied!';
      statusMsg.className = 'coupon-status success';
      updateCartUI();
      showToast('Promo code BHAMI10 applied successfully!', 'success');
    } else if (code === 'UTSAV') {
      STATE.appliedCoupon = { code: 'UTSAV', discountFixed: 200 };
      statusMsg.textContent = '✓ Flat ₹200 Festive Discount Applied!';
      statusMsg.className = 'coupon-status success';
      updateCartUI();
      showToast('Festive code UTSAV applied successfully!', 'success');
    } else {
      statusMsg.textContent = 'Invalid promo code. Try "BHAMI10" or "UTSAV"';
      statusMsg.className = 'coupon-status error';
    }
  });
}

function setupWishlist() {
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      if (STATE.wishlist.size === 0) {
        showToast('Your wishlist is empty. Click the heart icon on any product to save it!', 'info');
      } else {
        showToast(`You have ${STATE.wishlist.size} handcrafted item(s) saved in your favorites.`, 'info');
      }
    });
  }
}

function toggleWishlist(productId) {
  if (STATE.wishlist.has(productId)) {
    STATE.wishlist.delete(productId);
    showToast('Removed item from your wishlist', 'info');
  } else {
    STATE.wishlist.add(productId);
    showToast('Saved item to your wishlist!', 'success');
  }
  saveWishlistToStorage();
  updateCartUI();
  renderProductGrid();
}

// ==========================================================================
// 9. EVENT LISTENERS & NAVIGATION HOOKS
// ==========================================================================

function setupEventListeners() {
  // Dismiss Demo Notice Bar
  const dismissBtn = document.getElementById('dismissDemoNotice');
  const demoNotice = document.querySelector('.demo-notice-bar');
  if (dismissBtn && demoNotice) {
    dismissBtn.addEventListener('click', () => {
      demoNotice.style.display = 'none';
    });
  }

  // Header scroll shadow
  const header = document.getElementById('boutiqueHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile drawer menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileDrawerOverlay');
  const mobileCloseBtn = document.getElementById('mobileDrawerCloseBtn');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileBtn) mobileBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Quick search dropdown drawer in header
  const searchToggleBtn = document.getElementById('searchToggleBtn');
  const searchDrawer = document.getElementById('quickSearchDrawer');
  const quickSearchInput = document.getElementById('quickSearchInput');
  const clearQuickSearch = document.getElementById('clearQuickSearch');

  if (searchToggleBtn && searchDrawer) {
    searchToggleBtn.addEventListener('click', () => {
      searchDrawer.classList.toggle('open');
      if (searchDrawer.classList.contains('open') && quickSearchInput) {
        quickSearchInput.focus();
      }
    });
  }

  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      STATE.searchQuery = q;
      const catSearchInput = document.getElementById('catalogueSearchInput');
      if (catSearchInput) catSearchInput.value = q;
      renderProductGrid();
    });
  }

  if (clearQuickSearch && quickSearchInput) {
    clearQuickSearch.addEventListener('click', () => {
      quickSearchInput.value = '';
      STATE.searchQuery = '';
      const catSearchInput = document.getElementById('catalogueSearchInput');
      if (catSearchInput) catSearchInput.value = '';
      renderProductGrid();
    });
  }

  // Quick search tag buttons
  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const tagQuery = tag.getAttribute('data-search');
      if (quickSearchInput) quickSearchInput.value = tagQuery;
      const catSearchInput = document.getElementById('catalogueSearchInput');
      if (catSearchInput) catSearchInput.value = tagQuery;
      STATE.searchQuery = tagQuery;
      renderProductGrid();
      // Scroll to catalogue
      const catSection = document.getElementById('catalogue');
      if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Catalogue search bar input
  const catalogueSearchInput = document.getElementById('catalogueSearchInput');
  const clearCatSearchBtn = document.getElementById('clearCatalogueSearch');

  if (catalogueSearchInput) {
    catalogueSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      STATE.searchQuery = val;
      if (clearCatSearchBtn) {
        clearCatSearchBtn.style.display = val ? 'block' : 'none';
      }
      renderProductGrid();
    });
  }

  if (clearCatSearchBtn && catalogueSearchInput) {
    clearCatSearchBtn.addEventListener('click', () => {
      catalogueSearchInput.value = '';
      STATE.searchQuery = '';
      clearCatSearchBtn.style.display = 'none';
      renderProductGrid();
    });
  }

  // Sort By select change
  const sortSelect = document.getElementById('sortBySelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      STATE.sortBy = e.target.value;
      renderProductGrid();
    });
  }

  // Category filter pills
  const pillContainer = document.getElementById('categoryFilterPills');
  if (pillContainer) {
    pillContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filterCat = pill.getAttribute('data-filter');
      STATE.activeCategory = filterCat;
      renderProductGrid();
    });
  }

  // Category Cards in the 2nd section (clicking "View Items")
  document.querySelectorAll('.filter-category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-category');
      activateCategoryFilter(cat);
    });
  });

  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      activateCategoryFilter(cat);
    });
  });

  // Footer category links
  document.querySelectorAll('.filter-category-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-cat');
      activateCategoryFilter(cat);
    });
  });

  function activateCategoryFilter(catName) {
    STATE.activeCategory = catName;
    document.querySelectorAll('.filter-pill').forEach(pill => {
      if (pill.getAttribute('data-filter') === catName) {
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
      } else {
        pill.classList.remove('active');
        pill.setAttribute('aria-selected', 'false');
      }
    });
    renderProductGrid();
    const catalogueSection = document.getElementById('catalogue');
    if (catalogueSection) {
      catalogueSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Reset Filters button
  const resetBtn = document.getElementById('resetAllFiltersBtn');
  const emptyResetBtn = document.getElementById('emptyResetBtn');

  function resetAllFilters() {
    STATE.activeCategory = 'all';
    STATE.searchQuery = '';
    if (catalogueSearchInput) catalogueSearchInput.value = '';
    if (quickSearchInput) quickSearchInput.value = '';
    if (clearCatSearchBtn) clearCatSearchBtn.style.display = 'none';

    document.querySelectorAll('.filter-pill').forEach(p => {
      if (p.getAttribute('data-filter') === 'all') {
        p.classList.add('active');
        p.setAttribute('aria-selected', 'true');
      } else {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      }
    });
    renderProductGrid();
  }

  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  // Cart Drawer open/close buttons
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const startShoppingBtn = document.getElementById('startShoppingBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  if (startShoppingBtn) {
    startShoppingBtn.addEventListener('click', () => {
      closeCartDrawer();
      const catSection = document.getElementById('catalogue');
      if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  // Product Grid Delegated Events (Add to cart, Quickview, Wishlist)
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-action="add-cart"]');
      if (addBtn) {
        e.stopPropagation();
        const id = addBtn.getAttribute('data-id');
        addToCart(id, 1, true);
        return;
      }

      const wishlistBtn = e.target.closest('[data-action="wishlist"]');
      if (wishlistBtn) {
        e.stopPropagation();
        const id = wishlistBtn.getAttribute('data-id');
        toggleWishlist(id);
        return;
      }

      const quickviewBtn = e.target.closest('[data-action="quickview"]');
      if (quickviewBtn) {
        e.stopPropagation();
        const id = quickviewBtn.getAttribute('data-id');
        openProductModal(id);
        return;
      }
    });
  }

  // Cart Items List Delegated Events (Qty +, Qty -, Remove)
  const cartItemsList = document.getElementById('cartItemsList');
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('[data-cart-action="inc"]');
      if (incBtn) {
        const id = incBtn.getAttribute('data-id');
        const item = STATE.cart.find(i => i.id === id);
        if (item) updateCartItemQty(id, item.quantity + 1);
        return;
      }

      const decBtn = e.target.closest('[data-cart-action="dec"]');
      if (decBtn) {
        const id = decBtn.getAttribute('data-id');
        const item = STATE.cart.find(i => i.id === id);
        if (item) updateCartItemQty(id, item.quantity - 1);
        return;
      }

      const removeBtn = e.target.closest('[data-cart-action="remove"]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        removeCartItem(id);
        return;
      }
    });
  }

  // Product Quick View Modal Close handlers
  const closeProdModal = document.getElementById('closeProductModal');
  const prodBackdrop = document.getElementById('productModalBackdrop');
  if (closeProdModal) closeProdModal.addEventListener('click', closeProductModal);
  if (prodBackdrop) prodBackdrop.addEventListener('click', closeProductModal);

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      // Close other items
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const qBtn = i.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Contact Form Submission -> Open WhatsApp directly with all entered customer details
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const phone = document.getElementById('contactPhone')?.value.trim();
      const subject = document.getElementById('contactSubject')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !phone || !message) {
        showToast('Please fill in your Name, Email, Phone Number, and Message.', 'warning');
        return;
      }

      // Format WhatsApp pre-filled text with all entered fields
      const subjectText = subject || 'General Inquiry';
      const waMessage = 
`*Namaste Bhami Craft Boutique!* 🙏

I would like to inquire about your handcrafted creations:

*Name:* ${name}
*Email:* ${email}
*Phone Number:* ${phone}
*Subject:* ${subjectText}

*Message:*
${message}`;

      // Boutique WhatsApp Helpline Number (can be configured by owner in window.BOUTIQUE_WHATSAPP_PHONE)
      const boutiquePhone = (window.BOUTIQUE_WHATSAPP_PHONE || '919800000000').replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(waMessage);
      const waUrl = boutiquePhone 
        ? `https://wa.me/${boutiquePhone}?text=${encodedMsg}`
        : `https://api.whatsapp.com/send?text=${encodedMsg}`;

      // Persist contact enquiry to SQLite database for the Admin Dashboard
      fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: subjectText,
          message
        })
      }).then(r => r.json()).then(res => {
        if (res && res.success) {
          console.log(`Customer enquiry recorded: #${res.enquiryId}`);
        }
      }).catch(err => {
        console.warn('Network sync notice:', err);
      });

      // Directly open WhatsApp with all pre-filled details
      const waWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!waWin) {
        window.location.href = waUrl;
      }

      showToast(`Opening WhatsApp chat for ${name}...`, 'success');
      contactForm.reset();
    });
  }

  // Newsletter Form Submission (Demo simulation)
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail')?.value.trim();
      if (email) {
        showToast('Thank you for subscribing to the Bhami Craft Gazette!', 'success');
        newsletterForm.reset();
      }
    });
  }

  // Demo Links click notification
  document.querySelectorAll('.demo-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('This is a simulated demo placeholder link.', 'info');
    });
  });

  // Global Keyboard shortcuts: Escape key closes all open modals & drawers
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeProductModal();
      closeMobileMenu();

      const chkModal = document.getElementById('checkoutModal');
      const rcpModal = document.getElementById('receiptModal');
      const outfitModal = document.getElementById('outfitReceiptModal');
      const adminModal = document.getElementById('adminDashboardModal');
      const lightboxModal = document.getElementById('imageLightboxModal');
      const chkBackdrop = document.getElementById('checkoutModalBackdrop');
      const rcpBackdrop = document.getElementById('receiptModalBackdrop');
      const outfitBackdrop = document.getElementById('outfitReceiptModalBackdrop');
      const adminBackdrop = document.getElementById('adminDashboardBackdrop');

      if (chkModal) chkModal.classList.remove('open');
      if (chkBackdrop) chkBackdrop.classList.remove('active');
      if (rcpModal) rcpModal.classList.remove('open');
      if (rcpBackdrop) rcpBackdrop.classList.remove('active');
      if (outfitModal) outfitModal.classList.remove('open');
      if (outfitBackdrop) outfitBackdrop.classList.remove('active');
      if (adminModal) adminModal.classList.remove('open');
      if (adminBackdrop) adminBackdrop.classList.remove('active');
      if (lightboxModal) lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open-lock');
    }
  });
}

// ==========================================================================
// 10. TOAST NOTIFICATION SYSTEM
// ==========================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '<i class="fa-solid fa-circle-info"></i>';
  if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3.8 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3800);
}

/**
 * Utility: HTML sanitizer
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// 11. INITIALIZATION ON DOM READY
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  renderProductGrid();
  updateCartUI();
  setupCustomOrderBuilder();
  setupOutfitCustomizationStudio();
  setupDemoCheckout();
  setupCoupons();
  setupWishlist();
  setupAdminDashboard();
  setupImageLightbox();
  updateAdminBadges();
  setupEventListeners();

  console.log('✨ Bhami Craft Boutique demo initialized successfully! ✨');
});
