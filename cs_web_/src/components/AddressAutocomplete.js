import React, { useRef, useEffect } from 'react';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];

const AddressAutocomplete = ({ value, onChange }) => {
    const searchBoxRef = useRef(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (searchBoxRef.current) {
            searchBoxRef.current.addListener('places_changed', () => {
                const places = searchBoxRef.current.getPlaces();
                if (places.length > 0) {
                    onChange(places[0].formatted_address);
                }
            });
        }
    }, [searchBoxRef]);

    if (loadError) {
        return <div>Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter address"
                style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `100%`,
                    height: `40px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                }}
            />
        </StandaloneSearchBox>
    );
};

export default AddressAutocomplete;
