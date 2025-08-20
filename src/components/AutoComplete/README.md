# AutoComplete Components

This directory contains reusable autocomplete components for Google Places API integration.

## Components

### AutocompleteCustom

A search input component that provides autocomplete suggestions for places using the Google Places API.

**Props:**

- `onPlaceSelect: (place: google.maps.places.Place | null) => void` - Callback function called when a place is selected

**Usage:**

```tsx
import { AutocompleteCustom } from '@/components/AutoComplete';

const MyComponent = () => {
  const handlePlaceSelect = (place: google.maps.places.Place | null) => {
    console.log('Selected place:', place);
  };

  return <AutocompleteCustom onPlaceSelect={handlePlaceSelect} />;
};
```

### AutocompleteResult

A component that handles the visual result of a selected place, typically used with a map.

**Props:**

- `place: google.maps.places.Place | null` - The selected place object

**Usage:**

```tsx
import AutocompleteResult from '@/components/AutoCompleteResult';

const MyMapComponent = () => {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);

  return (
    <div>
      <AutocompleteCustom onPlaceSelect={setSelectedPlace} />
      <AutocompleteResult place={selectedPlace} />
    </div>
  );
};
```

## Hook

### useAutocompleteSuggestions

A custom hook that manages autocomplete suggestions from the Google Places API.

**Parameters:**

- `inputString: string` - The search input string
- `requestOptions: Partial<google.maps.places.AutocompleteRequest>` - Optional request options

**Returns:**

- `suggestions: google.maps.places.AutocompleteSuggestion[]` - Array of autocomplete suggestions
- `isLoading: boolean` - Loading state
- `resetSession: () => void` - Function to reset the session token

**Usage:**

```tsx
import { useAutocompleteSuggestions } from '@/hooks/use-autocomplete-suggestions';

const MyComponent = () => {
  const [input, setInput] = useState('');
  const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(input, {
    includedPrimaryTypes: ['restaurant'],
  });

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      {isLoading && <div>Loading...</div>}
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion.placePrediction?.text.text}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Dependencies

These components require the following dependencies:

- `@vis.gl/react-google-maps` - For Google Maps integration
- Google Maps API with Places library enabled

## Styling

The components use SCSS for styling. The main styles are in `styles.scss` and can be customized as needed.
