import { useMoviePoster } from "../../../hooks/useMoviePoster";

const PosterPicture = ({ item }) => {
    const { currentSrc, handleError } = useMoviePoster(
        item.poster,
        item.poster2,
        item.titleId
    )

    return (
        <img
            src={currentSrc}
            onError={handleError}
            alt="poster"
            style={{
                width: '45px',
                height: '65px',
                objectFit: 'cover',
                marginRight: '12px',
                borderRadius: '4px'
            }}
        />
    )
}

export default PosterPicture;