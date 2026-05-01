import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FF5A00',
          borderRadius: '50%',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          style={{ width: '70%', height: '70%', color: 'white' }}
          fill="currentColor"
        >
          <path d="M50 0 L57 35 L95 15 L65 43 L100 50 L65 57 L95 85 L57 65 L50 100 L43 65 L5 85 L35 57 L0 50 L35 43 L5 15 L43 35 Z" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
