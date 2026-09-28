import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#042f2e',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '128px',
          color: '#10b981',
          fontSize: 250,
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        DL
      </div>
    ),
    {
      ...size,
    }
  )
}
