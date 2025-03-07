import { Box, Button, Modal, Text } from '@mantine/core';

interface SearchExportDialogProps {
  visible: boolean;
  exportCsv?: () => void;
  exportTransactionBundle?: () => void;
  onCancel: () => void;
}

export function SearchExportDialog(props: SearchExportDialogProps): JSX.Element | null {
  return (
    <Modal title="Export" closeButtonProps={{ 'aria-label': 'Close' }} opened={props.visible} onClose={props.onCancel}>
      <Box display="flex" style={{ justifyContent: 'space-between' }}>
        {props.exportCsv && <ExportButton text="CSV" exportLogic={props.exportCsv} onCancel={props.onCancel} />}
        {props.exportTransactionBundle && (
          <ExportButton
            text="Transaction Bundle"
            exportLogic={props.exportTransactionBundle}
            onCancel={props.onCancel}
          />
        )}
      </Box>
      <Text style={{ marginTop: '10px', marginLeft: '2px' }}>Limited to 1000 records</Text>
    </Modal>
  );
}

interface ExportButtonProps {
  text: string;
  exportLogic: () => void;
  onCancel: () => void;
}

export function ExportButton(props: ExportButtonProps): JSX.Element {
  return (
    <Button
      onClick={() => {
        props.exportLogic();
        props.onCancel();
      }}
    >
      {`Export as ${props.text}`}
    </Button>
  );
}
