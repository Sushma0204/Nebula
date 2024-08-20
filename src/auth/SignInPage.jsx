import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function SignInPage() {
  return (
    <div className="flex items-center justify-center my-20">
            <SignIn
        appearance={{
          elements: {
            button: {
              className: "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none py-2 px-4 rounded",
            },
          },
        }}
      />
    </div>
  )
}

export default SignInPage
