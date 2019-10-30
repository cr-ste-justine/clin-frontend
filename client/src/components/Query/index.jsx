/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual, find } from 'lodash';
import {
  Dropdown, Icon, Menu, Input, Divider, Badge,
} from 'antd';
import copy from 'copy-to-clipboard';
const Joi = require('@hapi/joi');

import './style.scss';
import { INSTRUCTION_TYPE_FILTER, FILTER_TYPES } from './Filter/index';
import GenericFilter from './Filter/Generic';
import NumericalComparisonFilter from './Filter/NumericalComparison';
import GenericBooleanFilter from './Filter/GenericBoolean'
import Operator, { INSTRUCTION_TYPE_OPERATOR, OPERATOR_TYPES } from './Operator';
import Subquery, { INSTRUCTION_TYPE_SUBQUERY, SUBQUERY_TYPES } from './Subquery';
import {convertIndexToColor, convertIndexToLetter} from './Statement';
import {FILTER_TYPE_GENERIC , FILTER_TYPE_NUMERICAL_COMPARISON , FILTER_TYPE_GENERICBOOL} from './Filter/index'

export const DEFAULT_EMPTY_QUERY = {};

const QUERY_ACTION_COPY = 'copy';
const QUERY_ACTION_UNDO_ALL = 'undo-all';
const QUERY_ACTION_DELETE = 'delete';
const QUERY_ACTION_DUPLICATE = 'duplicate';
const QUERY_ACTION_COMPOUND_OPERATORS = 'compound-operators';
const QUERY_ACTION_VIEW_SQON = 'view-sqon';
const QUERY_ACTION_TITLE = 'title';

export const sanitizeInstructions = (instructions) => {
    instructions = sanitizeSubqueries(instructions);
    instructions = sanitizeFilters(instructions);
    instructions = sanitizeOperators(instructions);
    return instructions;
}

const sanitizeOperators = (instructions) => {
  // @NOTE No subsequent operators
  let lastOperatorIndex = null;
  const sanitizedInstructions = instructions.filter((instruction, index) => {
    if (instruction.type === INSTRUCTION_TYPE_OPERATOR) {
      if (lastOperatorIndex !== null && ((lastOperatorIndex + 1) === index)) {
        lastOperatorIndex = index;
        return false;
      }
      lastOperatorIndex = index;
    }
    return true;
  });

  // @NOTE No prefix operator
  if (sanitizedInstructions[0] && sanitizedInstructions[0].type === INSTRUCTION_TYPE_OPERATOR) {
      sanitizedInstructions.shift();
  }

  // @NOTE No suffix operator
  const instructionsLength = sanitizedInstructions.length - 1;
  if (sanitizedInstructions[instructionsLength] && sanitizedInstructions[instructionsLength].type === INSTRUCTION_TYPE_OPERATOR) {
    sanitizedInstructions.pop();
  }

  // @No subsequent filters or subqueries without an operator
  for(let i in sanitizedInstructions){
    const defaultOperator = {data:{type:"and"} ,
                             type:INSTRUCTION_TYPE_OPERATOR }
    const operator = find(sanitizedInstructions, ['type', INSTRUCTION_TYPE_OPERATOR]) ? find(sanitizedInstructions, ['type', INSTRUCTION_TYPE_OPERATOR]) : defaultOperator
    const next = Number(i)+1
    if(next < sanitizedInstructions.length){
        if(sanitizedInstructions[i].type === INSTRUCTION_TYPE_FILTER || sanitizedInstructions[i].type === INSTRUCTION_TYPE_SUBQUERY){
            if(sanitizedInstructions[next].type === INSTRUCTION_TYPE_FILTER || sanitizedInstructions[next].type === INSTRUCTION_TYPE_SUBQUERY){
                sanitizedInstructions.splice(next, 0, operator);
            }
        }
    }
  }

  return sanitizedInstructions;
};

const sanitizeSubqueries = (instructions) => {
  if (instructions.length === 1 && instructions[0].type === INSTRUCTION_TYPE_SUBQUERY) {
    instructions.shift();
  }

  return instructions;
};

// @NOTE No subsequent filters
const sanitizeFilters = instructions => instructions;


class Query extends React.Component {
  constructor(props) {
    super(props);
    this.addInstruction = this.addInstruction.bind(this);
    this.replaceInstruction = this.replaceInstruction.bind(this);
    this.removeInstruction = this.removeInstruction.bind(this);
    this.handleFilterRemoval = this.handleFilterRemoval.bind(this);
    this.handleOperatorRemoval = this.handleOperatorRemoval.bind(this);
    this.handleSubqueryRemoval = this.handleSubqueryRemoval.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleOperatorChange = this.handleOperatorChange.bind(this);
    this.handleSubqueryChange = this.handleSubqueryChange.bind(this);
    this.serialize = this.serialize.bind(this);
    this.sqon = this.sqon.bind(this);
    this.json = this.json.bind(this);
    this.createMenuComponent = this.createMenuComponent.bind(this);
    this.handleMenuSelection = this.handleMenuSelection.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAdvancedChange = this.handleAdvancedChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.hasTitle = this.hasTitle.bind(this);
  }

  addInstruction(instruction) {

    console.log('addInstruction', instruction)

      const { draft, display, index, onEditCallback } = this.props;
      const newDraft = cloneDeep(draft)

      newDraft.instructions.push(instruction);
      newDraft.instructions = sanitizeInstructions(newDraft.instructions);


    console.log('addInstruction newDraft', newDraft)


      onEditCallback({
        data: newDraft,
        display,
        index
      });
  }

  replaceInstruction(instruction) {
    console.log('replaceInstruction', instruction)
    const { draft, display, index, onEditCallback } = this.props;
    const newDraft = cloneDeep(draft)

    const instructionIndex = instruction.index
    delete instruction.index
    newDraft.instructions[instructionIndex] = instruction;

    console.log('addInstruction newDraft', newDraft)

    onEditCallback({
      data: newDraft,
      display,
      index
    });
  }

  removeInstruction(instruction) {

    console.log('removeInstruction', instruction)

    const { draft, display, index, onEditCallback, onRemoveCallback } = this.props;
    const instructionIndex = instruction.index;
    const newDraft = cloneDeep(draft)
    newDraft.instructions.splice(instructionIndex, 1);
    newDraft.instructions = sanitizeInstructions(newDraft.instructions);
    if (newDraft.instructions.length > 0) {
      onEditCallback({
        data: newDraft,
        display,
        index
      });
    } else {
      onRemoveCallback(this.serialize());
    }
  }

  handleFilterRemoval(filter) {
    this.removeInstruction(filter);
  }

  handleOperatorRemoval(operator) {
    this.removeInstruction(operator);
  }

  handleSubqueryRemoval(subquery) {
    this.removeInstruction(subquery);
  }

  handleFilterChange(filter) {

    console.log('handleFilterChange', filter)

    const instruction = {
      type: INSTRUCTION_TYPE_FILTER,
      data: filter
    };


    /*
          const { data } = this.state;
      const { onEditCallback } = this.props;
      data.instructions.push(item);
      data.instructions = sanitizeInstructions(data.instructions);
      this.setState({
     */



    if (filter.index !== undefined) {
      instruction.index = filter.index
      delete instruction.data.index
      this.replaceInstruction(instruction);
    } else {
      this.addInstruction(instruction)
    }
  }

  // @NOTE All operators within a query must have the same type
  handleOperatorChange(operator) {
    const { draft, onEditCallback } = this.props;
    const instructions = draft.instructions.map((datum) => {
      if (datum.type === INSTRUCTION_TYPE_OPERATOR) {
        datum.data.type = operator.data.type;
      }
      return datum;
    });
    const updatedDraft = {
      ...draft,
      instructions
    }
    onEditCallback(updatedDraft);
  }

  handleSubqueryChange(subquery) {
    this.replaceInstruction({
      type: INSTRUCTION_TYPE_SUBQUERY,
      index: subquery.index,
      data: subquery.data,
      options: subquery.options,
    });
  }

  handleTitleChange(e) {
    const title = e.target.value;
    const { draft, onEditCallback } = this.props;
    if (title !== draft.title) {
      const serialized = this.serialize();
      newDraft.data.title = title
      onEditCallback(serialized);
    }
  }

  handleAdvancedChange(e) {
    const { options, display, draft } = this.props;
    const { editable } = options;
    if (editable) {
      const {value} = e.target;
      let rawQuery = draft;
      try {
        rawQuery = JSON.parse(value);
        const QuerySchema = Joi.object().keys({
          title: Joi.string(),
          instructions: Joi.array().items(Joi.object().keys({
            type: Joi.string().valid(INSTRUCTION_TYPE_FILTER, INSTRUCTION_TYPE_OPERATOR, INSTRUCTION_TYPE_SUBQUERY).required(),
            //data: Joi.object()


            /*
            filter: Joi.string().when(
              'type', {
                is: INSTRUCTION_TYPE_FILTER,
                then: Joi.object().keys({
                  data: Joi.object().keys({
                    id: Joi.string().required(),
                    type: Joi.string().valid('generic', 'specific').required(),
                    operand: Joi.string().valid('all', 'one', 'none').required(),
                    values: Joi.array().items(Joi.string()).required(),
                  }).required()
                })
              }),
              */

            /*
                        operator: Joi.string().when(
                          'type', {
                            is: INSTRUCTION_TYPE_OPERATOR,
                            then: Joi.object().keys({
                              data: Joi.object().keys({
                                type: Joi.string().valid(OPERATOR_TYPES).required()
                              })
                            })
                        }),
            */
            /*
            subquery: Joi.string().when(
              'type', {
                is: INSTRUCTION_TYPE_SUBQUERY,
                then: Joi.object().keys({
                  data: Joi.object().keys({
                    type: Joi.string().valid('generic', 'specific').required(),
                  }).required()
                })
              }),
              */
          }))
        });

      const validation = Joi.validate(rawQuery, QuerySchema);
      display.viewableSqonIsValid = !validation.error;

      } catch (e) {
        display.viewableSqonIsValid = false;
        console.log(e)
      }



      this.setState({
        display,
      }, () => {
        if (this.props.onEditCallback) {
          this.props.onEditCallback(rawQuery);
        }
      });
    }
  }

  json() {
    const { draft } = this.props;
    const instructions = draft.instructions.map((datum) => {
      delete datum.key;
      delete datum.display;
      return datum;
    });
    return { ...draft, instructions };
  }

  sqon() {
    const { draft } = this.props;
    const sqon = draft.instructions.map((datum) => {
      delete datum.key;
      delete datum.display;
      return datum;
    });
    return sqon;
  }

  serialize() {
    const { draft, display, index } = this.props;
    return {
      data: draft,
      display,
      index,
    };
  }

  handleClick(e) {
    const { onClickCallback, draft } = this.props;
    onClickCallback(draft.key);
  }

  handleMenuSelection({ key }) {
    const { display, draft, index } = this.props;
    switch (key) {
      case QUERY_ACTION_COPY:
        const sqon = JSON.stringify(this.sqon());
        copy(sqon);
        this.props.onCopyCallback(sqon);
        break;
      case QUERY_ACTION_VIEW_SQON:
        const updatedDisplayViewSqon = {
          ...display,
          viewableSqon: !display.viewableSqon,
        };
        this.props.onDisplayCallback({ display: updatedDisplayViewSqon, index});
        break;
      case QUERY_ACTION_COMPOUND_OPERATORS:
        const updatedDisplayCompoundOperators = {
          ...display,
          compoundOperators: !display.compoundOperators,
        };
        this.props.onDisplayCallback({ display: updatedDisplayCompoundOperators, index });
        break;
      case QUERY_ACTION_TITLE:
        const newDraft = cloneDeep(draft);
        if (!this.hasTitle()) {
          newDraft.title = '';
        } else {
          delete newDraft.title;
        }
        this.props.onEditCallback({
          data: newDraft,
          display,
          index,
        });
        break;
      case QUERY_ACTION_DELETE:
        this.props.onRemoveCallback(draft.key);
        break;
      case QUERY_ACTION_DUPLICATE:
        this.props.onDuplicateCallback(this.serialize());
        break;
      case QUERY_ACTION_UNDO_ALL:
        const { original } = this.props;
        const clone = cloneDeep(original);
        this.props.onEditCallback(clone);
        break;
      default:
        break;
    }
  }

  hasTitle() {
    const { draft } = this.props;
    return draft.title !== undefined;
  }

  createMenuComponent() {
    const { options, original, intl, display } = this.props;
    const {
      copyable, duplicatable, editable, removable, undoable,
    } = options;
    const { compoundOperators, viewableSqon } = display;
    const menuAdd = intl.formatMessage({ id: 'screen.patientvariant.query.menu.add' });
    const menuRemove = intl.formatMessage({ id: 'screen.patientvariant.query.menu.remove' });
    const menuCopy = intl.formatMessage({ id: 'screen.patientvariant.query.menu.copy' });
    const menuMaximize = intl.formatMessage({ id: 'screen.patientvariant.query.menu.maximize' });
    const menuMinimize = intl.formatMessage({ id: 'screen.patientvariant.query.menu.minimize' });
    const menuDuplicate = intl.formatMessage({ id: 'screen.patientvariant.query.menu.duplicate' });
    const menuRevert = intl.formatMessage({ id: 'screen.patientvariant.query.menu.revert' });
    const menuAdvancedEditor = intl.formatMessage({ id: 'screen.patientvariant.query.menu.advancedEditor' });
    const menuDelete = intl.formatMessage({ id: 'screen.patientvariant.query.menu.delete' });
    const titleMetaIsPresent = this.hasTitle();

    return (
      <Menu onClick={this.handleMenuSelection}>
        {editable && (
        <Menu.Item key={QUERY_ACTION_TITLE}>
          <Icon type={`file${(titleMetaIsPresent ? '' : '-text')}`} />
          {(titleMetaIsPresent ? menuRemove : menuAdd)}
        </Menu.Item>
        )
      }
        {copyable && (
        <Menu.Item key={QUERY_ACTION_COPY}>
          <Icon type="font-size" />
            {menuCopy}
        </Menu.Item>
        )
      }
        <Menu.Item key={QUERY_ACTION_COMPOUND_OPERATORS}>
          <Icon type={`${(compoundOperators ? 'plus' : 'minus')}-circle`} />
          {(compoundOperators ? menuMaximize : menuMinimize)}
        </Menu.Item>
        {duplicatable && (
        <Menu.Item key={QUERY_ACTION_DUPLICATE}>
          <Icon type="file-add" />
            {menuDuplicate}
        </Menu.Item>
        )
      }
        {undoable && original && (
        <Menu.Item key={QUERY_ACTION_UNDO_ALL}>
          <Icon type="undo" />
            {menuRevert}
        </Menu.Item>
        )
      }
        {editable && (
        <Menu.Item key={QUERY_ACTION_VIEW_SQON}>
          <Icon type={`eye${(viewableSqon ? '-invisible' : '')}`} />
            {menuAdvancedEditor}
        </Menu.Item>
        )
      }
        {removable && (
        <Menu.Item key={QUERY_ACTION_DELETE}>
          <Icon type="delete" />
            {menuDelete}
        </Menu.Item>
        )
      }
      </Menu>
    );
  }

  render() {
    const { active, options, original, onSelectCallback, findQueryIndexForKey, results, intl, facets, categories, draft, searchData, display } = this.props;
    const {
      copyable, duplicatable, removable, undoable,
    } = options;
    const hasMenu = copyable || duplicatable || removable || undoable;
    const { compoundOperators, viewableSqon, viewableSqonIsValid } = display;
    const isDirty = !isEqual(original, draft);
    let operatorsHandler = null;
    if (compoundOperators) {
      const operator = find(draft.instructions, {'type': INSTRUCTION_TYPE_OPERATOR});
      if (operator) {
        operatorsHandler = (
          <Operator
            key={operator.key}
            options={options}
            data={operator.data}
            intl={intl}
            onEditCallback={this.handleOperatorChange}
          />
        );
      }
    }
    const query = draft.instructions ? (
      <div className={`query${(isDirty ? ' dirty' : '')}`} onClick={this.handleClick}>
        {this.hasTitle()
          && (
          <Input
            size="small"
            className="title"
            allowClear
            placeholder="Add Title"
            defaultValue={draft.title}
            onBlur={this.handleTitleChange}
            onPressEnter={this.handleTitleChange}
          />
          )
        }
        <div className="instructions">
          { !viewableSqon && draft.instructions.map((item, index) => {
            switch (item.type) {
              case INSTRUCTION_TYPE_OPERATOR:
                if (compoundOperators) {
                  return null;
                }
                return (
                  <Operator
                    index={index}
                    options={options}
                    data={item.data}
                    intl={intl}
                    onEditCallback={this.handleOperatorChange}
                    key={index}
                  />
                );
              case INSTRUCTION_TYPE_FILTER:
                let category = null
                let type = null
                categories.map((x, index) => {
                    const value = find(x.filters, ['id', item.data.id]  );
                    if(value){
                        category = x.id
                        type = value.type
                    }
                })

                if(type === FILTER_TYPE_GENERIC){
                    return (
                        <GenericFilter
                            index={index}
                            options={options}
                            data={item.data}
                            dataSet={facets[item.data.id] || []}
                            intl={intl}
                            category={category}
                            onEditCallback={this.handleFilterChange}
                            onRemoveCallback={this.handleFilterRemoval}
                            onSelectCallback={onSelectCallback}
                            key={index}
                          />
                    );
                }else if(type === FILTER_TYPE_NUMERICAL_COMPARISON){
                    return (
                        <NumericalComparisonFilter
                           index={index}
                           options={options}
                           data={item.data}
                           dataSet={facets[item.data.id] || []}
                           intl={intl}
                           category={category}
                           onEditCallback={this.handleFilterChange}
                           onRemoveCallback={this.handleFilterRemoval}
                           onSelectCallback={onSelectCallback}
                           key={index}
                       />
                    );
                }else if(type === FILTER_TYPE_GENERICBOOL){

                const categoryInfo =find(categories, ['id', category]);
                const categoryData = find(categoryInfo.filters, ['id', item.data.id]);

                  const allOption = []
                  Object.keys(categoryData.search).map((keyName) => {
                      const data = find(searchData, ['id', keyName])
                      if (data && data.data[0]) {
                        const count = data.data[0].count
                        allOption.push({value:keyName , count:count})
                      }
                    }
                  )
                     return (
                         <GenericBooleanFilter
                          index={index}
                          options={options}
                          data={item.data}
                          dataSet={allOption ? allOption : []}
                          intl={intl}
                          category={category}
                          onEditCallback={this.handleFilterChange}
                          onRemoveCallback={this.handleFilterRemoval}
                          onSelectCallback={onSelectCallback}
                          key={index}
                        />
                     );
                 }
                break;

              case INSTRUCTION_TYPE_SUBQUERY:
                const queryIndex = findQueryIndexForKey ? findQueryIndexForKey(item.data.query) : null;
                return (
                  <Subquery
                    index={index}
                    options={options}
                    data={item.data}
                    intl={intl}
                    queryIndex={queryIndex}
                    queryColor={active && queryIndex !== null ? convertIndexToColor(queryIndex) : null}
                    queryTitle={queryIndex !== null ? convertIndexToLetter(queryIndex) : index }
                    onEditCallback={this.handleSubqueryChange}
                    onRemoveCallback={this.handleSubqueryRemoval}
                    onSelectCallback={onSelectCallback}
                    key={index}
                  />
                );
              default:
                return null;
            }
          })}
          { viewableSqon && (
          <Input.TextArea
            value={JSON.stringify(this.json())}
            className={`no-drag${viewableSqonIsValid ? '' : ' invalid'}`}
            rows={2}
            onChange={this.handleAdvancedChange}
          />
          ) }
        </div>
        <div className="actions">
          { compoundOperators && ( operatorsHandler ) }
          { hasMenu && (<Divider type="vertical" />) }
          { hasMenu && (
          <Dropdown overlay={this.createMenuComponent} trigger = {['click']}>
            <Icon type="more" />
          </Dropdown>
          ) }
        </div>
      </div>
    ) : null;
    return !!results ? <Badge className={( active ? 'active' : 'inactive' )} count={results} overflowCount={9999}>{query}</Badge> : query
  }
}

Query.propTypes = {
  intl: PropTypes.shape({}).isRequired,
  draft: PropTypes.shape([]).isRequired,
  original: PropTypes.shape([]),
  display: PropTypes.shape({}),
  options: PropTypes.shape({}),
  active: PropTypes.bool,
  results: PropTypes.number,
  onClickCallback: PropTypes.func,
  onCopyCallback: PropTypes.func,
  onDisplayCallback: PropTypes.func,
  onEditCallback: PropTypes.func,
  onDuplicateCallback: PropTypes.func,
  onRemoveCallback: PropTypes.func,
  onSelectCallback: PropTypes.func,
  onUndoCallback: PropTypes.func,
  findQueryIndexForKey: PropTypes.func,
};

Query.defaultProps = {
  original : [],
  display: {
    compoundOperators: false,
    viewableSqon: false,
    viewableSqonIsValid: true,
  },
  options: {
    copyable: true,
    duplicatable: true,
    editable: true,
    removable: true,
    selectable: false,
    undoable: true,
  },
  active: false,
  results: null,
  onClickCallback: () => {},
  onCopyCallback: () => {},
  onDisplayCallback: () => {},
  onEditCallback: () => {},
  onDuplicateCallback: () => {},
  onRemoveCallback: () => {},
  onSelectCallback: () => {},
  onUndoCallback: () => {},
  findQueryIndexForKey: null,
};

export default Query;
