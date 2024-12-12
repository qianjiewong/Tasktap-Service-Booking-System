import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  function MyComponent({ setState, state }: { setState: any; state: any }) {
    return (
      <Select value={state} onValueChange={setState}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select State" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Johor">Johor</SelectItem>
          <SelectItem value="Kedah">Kedah</SelectItem>
          <SelectItem value="Kelantan">Kelantan</SelectItem>
          <SelectItem value="Kuala Lumpur">Kuala Lumpur</SelectItem>
          <SelectItem value="Labuan">Labuan</SelectItem>
          <SelectItem value="Melaka">Melaka</SelectItem>
          <SelectItem value="Negeri Sembilan">Negeri Sembilan</SelectItem>
          <SelectItem value="Pahang">Pahang</SelectItem>
          <SelectItem value="Perak">Perak</SelectItem>
          <SelectItem value="Perlis">Perlis</SelectItem>
          <SelectItem value="Pulau Pinang">Pulau Pinang</SelectItem>
          <SelectItem value="Putrajaya">Putrajaya</SelectItem>
          <SelectItem value="Sabah">Sabah</SelectItem>
          <SelectItem value="Sarawak">Sarawak</SelectItem>
          <SelectItem value="Selangor">Selangor</SelectItem>
          <SelectItem value="Terengganu">Terengganu</SelectItem>
        </SelectContent>
      </Select>
    );
  }
  
  export default MyComponent;
  