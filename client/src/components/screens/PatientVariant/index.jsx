/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEqual } from 'lodash';
import {
  Card, Descriptions, Typography, PageHeader,
} from 'antd';

import Header from '../../Header';
import Navigation from '../../Navigation';
import Content from '../../Content';
import Footer from '../../Footer';
import VariantNavigation from './components/VariantNavigation';
import VariantResultsTable from './components/VariantResultsTable';

import './style.scss';
import { patientShape } from '../../../reducers/patient';
import { variantShape } from '../../../reducers/variant';

import Statement from '../../Query/Statement';
import { createNewQuery, fetchSchema, selectQuery, replaceQuery, replaceQueries, removeQuery, duplicateQuery, sortStatement, searchVariants, undo, addInstruction, removeInstruction, replaceInstruction, changeQueryTitle } from '../../../actions/variant';


class PatientVariantScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateNewQuery = this.handleCreateNewQuery.bind(this);
    this.handleQuerySelection = this.handleQuerySelection.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleQueriesChange = this.handleQueriesChange.bind(this);
    this.handleQueriesRemoval = this.handleQueriesRemoval.bind(this);
    this.handleQueryDuplication = this.handleQueryDuplication.bind(this);
    this.handleStatementSort = this.handleStatementSort.bind(this);
    this.handleDraftHistoryUndo = this.handleDraftHistoryUndo.bind(this);
    this.handleAddInstruction = this.handleAddInstruction.bind(this);
    this.handleRemoveInstruction = this.handleRemoveInstruction.bind(this);
    this.handleReplaceInstruction = this.handleReplaceInstruction.bind(this);
    this.handleChangeQueryTitle = this.handleChangeQueryTitle.bind(this);

    // @NOTE Initialize Component State
    const { actions, variant } = props;
    const { schema } = variant;
    // @NOTE Make sure we have a schema defined in redux
    if (!schema.version) {
      actions.fetchSchema();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  handleCreateNewQuery() {
    const { actions } = this.props;
    actions.createNewQuery();
  }

  handleQuerySelection(key) {
    const { actions } = this.props;
    actions.selectQuery(key);
  }

  handleQueryChange(query) {
    const { actions } = this.props;
    actions.replaceQuery(query.data || query);
  }

  handleQueriesChange(queries, activeQuery) {
    const { actions } = this.props;
    actions.replaceQueries(queries, activeQuery);
  }

  handleQueriesRemoval(keys) {
    const { actions } = this.props;
    actions.removeQuery(keys);
  }

  handleQueryDuplication(query, index) {
    const { actions } = this.props;
    actions.duplicateQuery(query.data, index);
  }

  handleStatementSort(sortedQueries) {
    const { actions } = this.props;
    actions.sortStatement(sortedQueries)
  }

  handleDraftHistoryUndo() {
    const { actions } = this.props;
    actions.undo();
  }

  handleAddInstruction(instruction) {
    const { actions } = this.props;
    actions.addInstruction(instruction);
  }

  handleRemoveInstruction(instruction) {
    const { actions } = this.props;
    actions.removeInstruction(instruction);
  }

  handleReplaceInstruction(instruction) {
    const { actions } = this.props;
    actions.replaceInstruction(instruction);
  }

  handleChangeQueryTitle(changeQueryTitlePayload) {
    const { actions } = this.props;
    actions.changeQueryTitle(changeQueryTitlePayload);
  }

  render() {
    const { intl, variant } = this.props;
    const { draftQueries, draftHistory, originalQueries, facets, results, matches, schema, activeQuery, statementVersionNumber } = variant;
    const searchData = [];

    if (schema.categories) {
        schema.categories.forEach((category) => {
            searchData.push({
                id: category.id,
                type: 'category',
                label: intl.formatMessage({ id: `screen.patientvariant.${category.label}` }),
                data: category.filters ? category.filters.reduce((accumulator, filter) => {
                  const searcheableFacet = filter.facet ? filter.facet.map((facet) => {
                    return {
                      id: facet.id,
                      value: intl.formatMessage({ id: `screen.patientvariant.${(!facet.label ? filter.label : facet.label)}` }),
                    }
                  }) : []

                  return accumulator.concat(searcheableFacet)
                }, []) : []
            })
        })
    }
    if (facets[activeQuery]) {
      Object.keys(facets[activeQuery])
        .forEach((key) => {
          searchData.push({
            id: key,
            type: 'filter',
            label: intl.formatMessage({ id: `screen.patientvariant.filter_${key}` }),
            data: facets[activeQuery][key].map((value) => {
              return {
                id: value.value,
                value: value.value,
                count: value.count,
              }
            })
          })
        })
    }

    return (
      <Content>
        <Header />
        <Navigation />
        <Card>
          <PageHeader
              title={(
                  <div>
                    <Typography.Title level={2}>
                      Recherche de variants
                    </Typography.Title>
                  </div>
              )}
          />

            <Descriptions title="Patient [PT93993], Masculin, Proband, Affecté" layout="horizontal" column={1}>
                <Descriptions.Item label="Famille">[FA09383], Mère: [PT3983883] (Non affecté), Père: [PT4736] (Non affecté)</Descriptions.Item>
                <Descriptions.Item label="Signes">Epilepsie ([HP93993]), Schizophrénie ([HP2772])</Descriptions.Item>
                <Descriptions.Item label="Indication(s)">Anomalies neuro-psychiatriques</Descriptions.Item>
            </Descriptions>

            <VariantNavigation
                key="variant-navigation"
                className="variant-navigation"
                intl={intl}
                schema={schema}
                queries={draftQueries}
                activeQuery={activeQuery}
                data={facets[activeQuery] || {}}
                onEditCallback={this.handleQueryChange}
                onAddInstructionCallback={this.handleAddInstruction}
                onRemoveInstructionCallback={this.handleRemoveInstruction}
                onReplaceInstructionCallback={this.handleReplaceInstruction}
                searchData={searchData}
            />
            <br />
            <br />
            <Statement
              key={`variant-statement-v${statementVersionNumber}`}
              activeQuery={activeQuery}
              data={draftQueries}
              draftHistory={draftHistory}
              original={originalQueries}
              intl={intl}
              matches={matches}
              facets={facets}
              categories={schema.categories}
              options={{
                  copyable: true,
                  duplicatable: true,
                  editable: true,
                  removable: true,
                  reorderable: true,
                  selectable: true,
                  undoable: true,
              }}
              display={{
                  compoundOperators: true,
              }}
              onCreateNewQueryCallback={this.handleCreateNewQuery}
              onSelectCallback={this.handleQuerySelection}
              onSortCallback={this.handleStatementSort}
              onEditCallback={this.handleQueryChange}
              onBatchEditCallback={this.handleQueriesChange}
              onAddInstructionCallback={this.handleAddInstruction}
              onRemoveInstructionCallback={this.handleRemoveInstruction}
              onReplaceInstructionCallback={this.handleReplaceInstruction}
              onRemoveCallback={this.handleQueriesRemoval}
              onDuplicateCallback={this.handleQueryDuplication}
              onDraftHistoryUndoCallback={this.handleDraftHistoryUndo}
              onChangeQueryTitleCallback={this.handleChangeQueryTitle}
              searchData={searchData}
            />
            <br/>
            <br />
            <VariantResultsTable
                key="variant-results"
                intl={intl}
                results={results[activeQuery] || []}
            />
        </Card>
        <Footer />
      </Content>
    );
  }
}

PatientVariantScreen.propTypes = {
  intl: PropTypes.shape({}).isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  variant: PropTypes.shape(variantShape).isRequired,
  actions: PropTypes.shape({}).isRequired,
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    fetchSchema,
    selectQuery,
    replaceQuery,
    replaceQueries,
    removeQuery,
    duplicateQuery,
    sortStatement,
    searchVariants,
    createNewQuery,
    undo,
    addInstruction,
    removeInstruction,
    replaceInstruction,
    changeQueryTitle,
  }, dispatch),
});

const mapStateToProps = state => ({
  intl: state.intl,
  patient: state.patient,
  variant: state.variant,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(PatientVariantScreen));
