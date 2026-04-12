import './SignInSignUp.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

function SignInSignUp() {
  return (
    <>
      <header className='Header'>
        <div className='topComps'>
          <h1 className='name'>ComparePro</h1>
          <h3 className='purpose'>To Compare and contrast all your computer hardware needs</h3>
        </div>
      </header>

      <div className='Pictures'>
        <h5>This is where pictures will go for website that scroll through</h5>
        <h5>Captions of some sort per picture.</h5>
      </div>

      <footer className='Footer'>
        <div className='bottomComps'>
          <h3 className='options'>Sign In or Sign Up to get started</h3>
          <SignedOut>
            <div className='Buttons'>
              <SignInButton forceRedirectUrl="/home">
                <button className="authBtn">Sign In</button>
              </SignInButton>
              <SignUpButton forceRedirectUrl="/home">
                <button className="authBtn">Sign Up</button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </footer>
    </>
  )
}

export default SignInSignUp