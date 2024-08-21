import React, { FormEvent, useState } from 'react';
import { mock } from './data';

const FieldComponent = ({ item, setFormState }: { item: (typeof mock)[0]; setFormState: any }) => {
  const onChangeField = (e: FormEvent) => {
    const target = e.target as HTMLSelectElement;

    if (item.product_part_id) {
      setFormState((old: (typeof mock)[0][]) =>
        old.map((oldItem) =>
          oldItem.id === (item as any).product_part_id
            ? {
                ...oldItem,
                fields: oldItem.fields?.map((oldField) =>
                  oldField.id === (item as any).id ? { ...oldField, values: target.value } : oldField,
                ),
              }
            : oldItem,
        ),
      );
    } else {
      setFormState((old: (typeof mock)[0][]) =>
        old.map((oldItem) => (oldItem.id === item.id ? { ...oldItem, values: target.value } : oldItem)),
      );
    }
  };
  return (
    <p>
      <label>{item.name}</label>
      <select name={item.type} required={Boolean(item.is_required)} onChange={onChangeField}>
        {item.values?.map((value) => {
          const label = typeof value === 'string' ? value : value.name;
          const val = typeof value === 'string' ? value : value.id;
          return <option value={val} key={val}>{label}</option>;
        })}
      </select>
    </p>
  );
};

const formElementComponent = (item: (typeof mock)[0], setFormState: any) => {
  if (!item.fields) {
    return <FieldComponent item={item} setFormState={setFormState} key={item.uid}/>;
  } else {
    return (
      <fieldset id={`groups-${item.type}`} key={`groups-${item.type}`}>
        <legend>{item.name}</legend>
        {item.fields.map((field) => formElementComponent(field as any, setFormState))}
      </fieldset>
    );
  }
};

const App = () => {
  const [formState, setFormState] = useState<(typeof mock)[0][]>(mock);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(formState);
      }}
    >
      {mock.map((item) => formElementComponent(item, setFormState))}
      <button>Submit</button>
    </form>
  );
};

export default App;
