const ProfilePicture = ({ item }) => {
    return (<>
        {item.picture ? (
            <img
                src={item.picture}
                style={{
                    width: '45px',
                    height: '65px',
                    objectFit: 'cover',
                    marginRight: '12px',
                    borderRadius: '4px'
                }}
            />
        ) : (
            <i
                className="bi bi-person"
                style={{
                    fontSize: '3rem',
                    width: '45px',
                    height: '65px',
                    marginRight: '12px',
                    color: 'white',
                    opacity: 0.8
                }}
            />
        )}
    </>)
}

export default ProfilePicture;