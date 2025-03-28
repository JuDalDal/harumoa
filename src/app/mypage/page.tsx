// import { GetServerSideProps } from 'next';

const page = () => {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            My Page
        </div>
    );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {


//     return {
//         props:{

//         }
//     }
// }

export default page