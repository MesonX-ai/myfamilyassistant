import os

layout_path = "/Users/mesonx/MY LAB/myfamilyassistant/frontend/app/layout.tsx"

tail = '''export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — kept from the original layout. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD structured data — invisible to visitors, read by Google. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd, null, 2),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
'''

# Check what's currently in the file
with open(layout_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Current file size: {len(content)} bytes")
print(f"Current line count: {len(content.splitlines())}")
print(f"Ends with: ...{content[-100:]}")
print(f"Has RootLayout: {'RootLayout' in content}")
print(f"Has jsonLd: {'jsonLd' in content}")
