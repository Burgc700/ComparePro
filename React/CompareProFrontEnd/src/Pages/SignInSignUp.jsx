import './Home.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

function SignInSignUp() {
  return (
    <header>
      {/* Show the sign-in and sign-up buttons when the user is signed out */}
      <SignedOut>
        <SignInButton forceRedirectUrl="/home" />
        <SignUpButton forceRedirectUrl="/home" />
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}

export default SignInSignUp