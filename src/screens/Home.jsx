import MainHeader from "../components/MainHeader/MainHeader"
import MainSlider from "../components/MainSlider/MainSlider"

function Home() {
    return (
        <>
            <MainHeader />
            <MainSlider />
            <div className='container' style={{ height: '500px', backgroundColor: '#000', color: 'gray', padding: '20px' }}>
                <p>Hola mundo!</p>
            </div>
        </>
    )
}

export default Home