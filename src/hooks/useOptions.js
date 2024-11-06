import { useSelector } from "react-redux";
import { selectAllCountries } from "@/services/countryApi";
import { selectAllRollTypes } from "@/services/rollType";
import { selectAllRollQualities } from "@/services/rollQuality";

const mapOptions = (data, key) => {
  return data.map((item) => ({
    value: item.id,
    label: item[key],
  }));
};

export const useOptions = (fieldDefinitions) => {
  const countries = useSelector(selectAllCountries) || [];
  const rollTypes = useSelector(selectAllRollTypes) || [];
  const qualities = useSelector(selectAllRollQualities) || [];

  const options = {
    madeInId: mapOptions(countries, "country"),
    typeId: mapOptions(rollTypes, "type"),
    qualityId: mapOptions(qualities, "quality"),
  };

  const updatedFields = fieldDefinitions.map((field) => {
    if (options[field.name]) {
      return { ...field, options: options[field.name] };
    }
    return field;
  });

  // Set default values based on options
  const optionsValues = {
    madeInId: options.madeInId.length > 0 ? options.madeInId[0].value : "",
    typeId: options.typeId.length > 0 ? options.typeId[0].value : "",
    qualityId: options.qualityId.length > 0 ? options.qualityId[0].value : "",
  };

  return {
    fields: updatedFields,
    optionsValues,
  };
};
