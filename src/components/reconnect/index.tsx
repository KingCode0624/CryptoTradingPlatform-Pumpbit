import Image from "next/image"

const Reconnect = (props: any) => {
    return (
        <div className="fixed top-0 left-0 flex justify-center items-center w-[100vw] h-[100vh]">
            <div
                className="fixed w-[600px] h-[400px] bg-[#1a1539] rounded-xl flex flex-col justify-between items-center"
            >
                <p className="text-white text-[40px] mt-4">Needs to Reconnect</p>
                <Image
                    src={"/assets/icons/reconnect.svg"}
                    width={200}
                    height={200}
                    alt="reconnect"
                />
                <button
                    className="w-[70%] h-[50px] bg-[#6F62D0] text-[white] text-[20px] rounded-3xl mb-10 hover:text-[25px] duration-200"
                    onClick={props.onClick}
                >
                    Reconnect
                </button>
            </div>
        </div>
    )
}

export default Reconnect