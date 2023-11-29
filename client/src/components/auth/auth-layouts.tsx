interface Props {
    children: React.ReactNode
  }
  
  const AuthLayout = ({ children }: Props) => {
    return (
      <div className='relative'>
        <div className='absolute -z-10 top-0 bottom-0 left-0 right-0 pattern-dots pattern-black pattern-bg-white pattern-size-8 pattern-opacity-5 min-h-screen backdrop-blur-sm' />
  
        <div className='container max-w-2xl mx-auto'>{children}</div>
      </div>
    )
  }
  
  export default AuthLayout