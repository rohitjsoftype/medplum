import { ValueSetExpandParams } from '@medplum/core';
import { ValueSetExpansionContains } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react-hooks';
import { useCallback } from 'react';
import {
  AsyncAutocomplete,
  AsyncAutocompleteOption,
  AsyncAutocompleteProps,
} from '../AsyncAutocomplete/AsyncAutocomplete';

export interface ValueSetAutocompleteProps
  extends Omit<AsyncAutocompleteProps<ValueSetExpansionContains>, 'loadOptions' | 'toKey' | 'toOption'> {
  binding: string | undefined;
  creatable?: boolean;
  clearable?: boolean;
  expandParams?: Partial<ValueSetExpandParams>;
}

function toKey(element: ValueSetExpansionContains): string {
  if (typeof element.code === 'string') {
    return element.code;
  }
  return JSON.stringify(element);
}

function getDisplay(item: ValueSetExpansionContains): string {
  if (typeof item.display === 'string') {
    return item.display;
  }
  return toKey(item);
}

function toOption(element: ValueSetExpansionContains): AsyncAutocompleteOption<ValueSetExpansionContains> {
  return {
    value: toKey(element),
    label: getDisplay(element),
    resource: element,
  };
}

function createValue(input: string): ValueSetExpansionContains {
  return {
    code: input,
    display: input,
  };
}

/**
 * A low-level component to autocomplete based on a FHIR Valueset.
 * This is the base component for CodeableConceptInput, CodingInput, and CodeInput.
 * @param props - The ValueSetAutocomplete React props.
 * @returns The ValueSetAutocomplete React node.
 */
export function ValueSetAutocomplete(props: ValueSetAutocompleteProps): JSX.Element {
  const medplum = useMedplum();
  const { binding, creatable, clearable, expandParams, ...rest } = props;

  const loadValues = useCallback(
    async (input: string, signal: AbortSignal): Promise<ValueSetExpansionContains[]> => {
      if (!binding) {
        return [];
      }
      const valueSet = await medplum.valueSetExpand(
        {
          ...expandParams,
          url: binding,
          filter: input,
        },
        { signal }
      );
      const valueSetElements = valueSet.expansion?.contains as ValueSetExpansionContains[];
      const newData: ValueSetExpansionContains[] = [];
      for (const valueSetElement of valueSetElements) {
        if (valueSetElement.code && !newData.some((item) => item.code === valueSetElement.code)) {
          newData.push(valueSetElement);
        }
      }

      return newData;
    },
    [medplum, expandParams, binding]
  );

  return (
    <AsyncAutocomplete
      {...rest}
      creatable={creatable ?? true}
      clearable={clearable ?? true}
      toOption={toOption}
      loadOptions={loadValues}
      onCreate={createValue}
    />
  );
}
