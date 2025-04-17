import React from 'react';
import './index.css'

function Main() {
        return (
            <>
            <header className='bg-black text-center text-2xl text-white py-5 absolute w-full'>MAFIA</header>
            <div className='h-full flex justify-center flex-col items-center gap-3'>
                <a href='/user' className='border-2 border-black w-[100px] py-2 rounded-lg text-center'>USER</a>
                <a href='/admin' className='border-2 border-black w-[100px] py-2 rounded-lg text-center'>ADMIN</a>
            </div>
            </>
        );
}

export default Main;