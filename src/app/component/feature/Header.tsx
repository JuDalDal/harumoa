"use client"; // 클라이언트 전용

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
    // 특정 페이지에서 숨김 처리
    const hiddenPaths = ["/mypage", "/setting"];
    const pathName = usePathname();

    const ishidden = hiddenPaths.includes(pathName);
    if (ishidden) return null;

    return (
        <div className="w-[90px] h-screen pt-[10px] pb-[30px] flex flex-col justify-between items-center border-r-4 border-black border-r-[1px]">
            <Image src="/logo.png" alt="Logo" width={73} height={73} />
            <div className="flex flex-col align-center gap-[25px]"> 
                <Link href="/mypage" className="block flex justify-center">
                    <Image src="/icons/account_circle.svg" alt="user logo" width={62} height={62} />
                </Link>
                <Link href="/setting" className="block flex justify-center">
                    <Image src="/icons/setting.svg" alt="setting logo" width={36} height={36} />
                </Link>
            </div>
        </div>
    );
}

export default Header;