export const metadata = {
  title: 'المستمع الذكي - مساحتك الخاصة للدعم والحديث',
  description: 'منصة محادثة تفاعلية تدعمك بالذكاء الاصطناعي',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#020617', 
        color: '#f8fafc', 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
      }}>
        {children}
      </body>
    </html>
  );
}
