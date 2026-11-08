import './globals.css';

export const metadata = {
  title: 'آکسیا (Auxia) | پلتفرم سازمانی ایجنت‌های هوش مصنوعی برای بازاریابی مدرن',
  description: 'آکسیا پلتفرم بازاریابی مبتنی بر ایجنت‌های هوش مصنوعی است که فرایندها را در تمامی ابزارهای شما اجرا کرده و تجربه‌ای کاملاً شخصی‌سازی‌شده و ۱:۱ برای هر مشتری خلق می‌کند.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className="w-mod-js" data-wf-page="6998a7a4efcd66d9f2857e6d" data-wf-site="6998a7a4efcd66d9f2857e79">
      <head>
        <link href="https://cdn.prod.website-files.com" rel="preconnect" crossOrigin="anonymous" />
        <link href="https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/css/auxia.shared.3374faec6.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/css/splide.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/plyr@3/dist/plyr.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`
          }}
        />
      </head>
      <body>
        {children}

        {/* SCRIPTS IN EXACT SYNCHRONOUS ORDER */}
        <script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6998a7a4efcd66d9f2857e79" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/js/auxia.schunk.36b8fb49256177c8.js" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/js/auxia.schunk.587508c25cc11a80.js" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/js/auxia.56bfb0bb.561b7f7e43ea0603.js" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/gsap/3.15.0/SplitText.min.js" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/gsap/3.15.0/DrawSVGPlugin.min.js" type="text/javascript"></script>
        <script src="https://cdn.prod.website-files.com/gsap/3.15.0/ScrollSmoother.min.js" type="text/javascript"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof gsap!=='undefined'){gsap.registerPlugin(ScrollTrigger,SplitText,DrawSVGPlugin,ScrollSmoother);}`
          }}
        />
        <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/js/splide.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll@0.5.3/dist/js/splide-extension-auto-scroll.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/plyr@3/dist/plyr.polyfilled.js"></script>

        {/* CUSTOM PAGE SCRIPTS */}
        <script src="/js/grid_canvas.js"></script>
        <script src="/js/lightbox.js"></script>
        <script src="/js/main.js"></script>
        <script src="/js/logo_splide.js"></script>
        <script src="/js/hero.js"></script>
      </body>
    </html>
  );
}

