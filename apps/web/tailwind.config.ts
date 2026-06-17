import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#2E7D32',
        leaf: '#66BB6A',
        sky: '#2196F3',
        ink: '#121212',
        mist: '#F8FAFC',
        accent: '#00C853',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.12), 0 20px 80px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(102,187,106,0.24), transparent 30%), radial-gradient(circle at top right, rgba(33,150,243,0.18), transparent 25%), linear-gradient(180deg, rgba(18,18,18,0.96), rgba(18,18,18,0.88))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,200,83,0.3)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0,200,83,0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
