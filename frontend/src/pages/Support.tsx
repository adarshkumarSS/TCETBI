import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Support = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/support/funding', { replace: true });
  }, [navigate]);

  return null;
};
