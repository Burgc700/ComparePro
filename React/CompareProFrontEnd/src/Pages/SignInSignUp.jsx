//Imports used to get the clerk stuff to create the sign in sign up buttons.
import './SignInSignUp.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import Logo from '../assets/Logo2.0.jpg'
import { SlideShow } from '../Components/LandingSlideShow';

//Function that renders the components for the signinsignup page.
function SignInSignUp() {
  //Sets all the items on the page.
  return (
    <>
      <header className='Header'>
        <div className='topComps'>
          <div className="img">
            <img className="img" src={Logo} alt="Logo"></img>
          </div>
          <div className="headerText">
            <h1 className='name'>ComparePro</h1>
            <h3 className='purpose'>To Compare and contrast all your computer hardware needs</h3>
          </div>
        </div>
      </header>

      <SlideShow></SlideShow>

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
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: "45px",
                    height: "45px",
                    // backgroundColor: "#2F5E86"
                    border: "2px solid #2F5E86"
                  }
                }
              }}
            />
          </SignedIn>
        </div>
      </footer>
    </>
  )
}

export default SignInSignUp