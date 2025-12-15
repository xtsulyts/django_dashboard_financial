import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

function GoogleSignInButton() {
  const responseGoogle = (response: CredentialResponse) => {
    console.log("Credencial recibida:", response.credential);
    
    // Envía el token a tu backend Django
    fetch('/api/auth/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.credential })
    })
    .then((fetchResponse: Response) => fetchResponse.json())
    .then((data: unknown) => {
      console.log("Respuesta del backend:", data);
      // Manejar el login exitoso (guardar token, redirigir, etc.)
    })
    .catch((error: Error) => {
      console.error("Error:", error);
    });
  };

  return (
    <GoogleLogin
      onSuccess={responseGoogle}
      onError={() => {
        console.log('Login Failed');
      }}
      useOneTap  // Opción para mostrar el one-tap login
    />
  );
}

export default GoogleSignInButton;