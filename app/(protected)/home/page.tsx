'use client';
import { logout } from '@/lib/auth/logout'
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout(); 
      router.push('/auth?mode=login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <div>
      <h1>Home Page.....</h1>
      <button onClick={handleLogout} className='py-2 px-4 text-black rounded-md bg-red-600'>Log Out</button>
    </div>
  )
}

export default Home
