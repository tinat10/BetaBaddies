import { Icon } from '@iconify/react';

interface OAuthButtonProps {
  provider: 'google' | 'linkedin' | 'github' | 'microsoft' | 'apple';
  label?: string;
}

const providerConfig = {
  google: {
    icon: 'mdi:google',
    color: '#DB4437',
    bgColor: '#ffffff',
    textColor: '#757575',
    borderColor: '#dadce0',
    label: 'Google',
  },
  linkedin: {
    icon: 'mdi:linkedin',
    color: '#0077B5',
    bgColor: '#0077B5',
    textColor: '#ffffff',
    borderColor: '#0077B5',
    label: 'LinkedIn',
  },
  github: {
    icon: 'mdi:github',
    color: '#333333',
    bgColor: '#333333',
    textColor: '#ffffff',
    borderColor: '#333333',
    label: 'GitHub',
  },
  microsoft: {
    icon: 'mdi:microsoft',
    color: '#00A4EF',
    bgColor: '#00A4EF',
    textColor: '#ffffff',
    borderColor: '#00A4EF',
    label: 'Microsoft',
  },
  apple: {
    icon: 'mdi:apple',
    color: '#000000',
    bgColor: '#000000',
    textColor: '#ffffff',
    borderColor: '#000000',
    label: 'Apple',
  },
};

export function OAuthButton({ provider, label }: OAuthButtonProps) {
  const config = providerConfig[provider];
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleOAuthLogin = () => {
    // Redirect to backend OAuth endpoint
    // The backend will handle the OAuth flow and redirect back to frontend
    window.location.href = `${apiBaseUrl}/api/v1/auth/${provider}`;
  };

  return (
    <button
      onClick={handleOAuthLogin}
      className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 font-medium hover:shadow-md"
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <Icon icon={config.icon} width={20} height={20} />
      <span>{label || `Continue with ${config.label}`}</span>
    </button>
  );
}

