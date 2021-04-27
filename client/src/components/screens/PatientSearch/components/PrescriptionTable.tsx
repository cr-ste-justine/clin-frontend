/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Row, Col, Typography, Button, Divider,
} from 'antd';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { FileTextOutlined } from '@ant-design/icons';
import IconKit from 'react-icons-kit';
import {
  ic_info_outline,
} from 'react-icons-kit/md';
import { generateNanuqReport } from '../../../../actions/nanuq';

import InteractiveTable from '../../../Table/InteractiveTable';

interface Props {
  defaultColumns: any[]
  size: number
  page: number
  total: any
  totalLength: any
  defaultVisibleColumns: any
  defaultColumnsOrder: any
  schema: never[]
  pageChangeCallback: any
  pageSizeChangeCallback: any
  exportCallback: any
  numFrozenColumns: any
  isLoading: any
  rowHeights: any
  columnsUpdated: any
  columnsOrderUpdated: any
  columnsReset: any
  customHeader: any
}

const PrescriptionTable: React.FC<Props> = ({
  defaultColumns,
  size,
  page,
  total,
  totalLength,
  defaultVisibleColumns,
  defaultColumnsOrder,
  schema,
  pageChangeCallback,
  pageSizeChangeCallback,
  exportCallback,
  isLoading,
  rowHeights,
  columnsUpdated,
  columnsOrderUpdated,
  columnsReset,
}) => {
  console.log('coucou', defaultColumns);
  const [selectedPatients, setselectedPatients] = useState([]);
  return (
    <div className="bp3-table-header">
      <div className="bp3-table-column-name">
        coucou
        { defaultColumns != null && (
          <InteractiveTable
            key="patient-interactive-table"
            size={size}
            page={page}
            total={total}
            totalLength={totalLength}
            defaultVisibleColumns={defaultVisibleColumns}
            defaultColumnsOrder={defaultColumnsOrder}
            schema={schema}
            pageChangeCallback={pageChangeCallback}
            pageSizeChangeCallback={pageSizeChangeCallback}
            exportCallback={exportCallback}
            numFrozenColumns={2}
            isLoading={isLoading}
            rowHeights={rowHeights}
            columnsUpdated={columnsUpdated}
            columnsOrderUpdated={columnsOrderUpdated}
            columnsReset={columnsReset}
            customHeader={(
              <Row align="middle" gutter={32}>
                { selectedPatients.length > 0 && (
                  <>
                    <Col>
                      <Typography.Text> {
                        intl.get('screen.patientsearch.table.selectedPatients',
                          { count: selectedPatients.length })
                      }
                      </Typography.Text>
                    </Col>
                  </>
                ) }
                <Col flex={1} className="patientSearch__table__header__nanuq">
                  <Button
                    disabled={selectedPatients.length === 0}
                    // onClick={() => actions.generateNanuqReport(selectedPatients)}
                  >
                    <FileTextOutlined />
                    { intl.get('screen.patientsearch.table.nanuq') }
                  </Button>
                  <Divider type="vertical" />
                </Col>
              </Row>
            )}
          />
        ) }
      </div>
    </div>
  );
};

export default PrescriptionTable;
