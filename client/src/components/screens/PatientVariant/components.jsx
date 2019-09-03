/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    find, findAll,
} from 'lodash';

import {
  Col, Row, Layout, Menu, Icon, Input,
} from 'antd';

import {INSTRUCTION_TYPE_FILTER, FILTER_TYPES, FILTER_TYPE_GENERIC} from '../../Query/Filter/index';
import GenericFilter from '../../Query/Filter/Generic';

import {
    fetchSchema,
} from '../../../actions/variant';
import { patientShape } from '../../../reducers/patient';
import { variantShape } from '../../../reducers/variant';


class VariantNavigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeCategoryId: null,
            activeFilterId: null,
        }
        this.handleFilterSearch = this.handleFilterSearch.bind(this);
        this.handleFilterSelection = this.handleFilterSelection.bind(this);
        this.handleCategoryOpenChange = this.handleCategoryOpenChange.bind(this);

        // @NOTE Initialize Component State
        const { actions, variant } = props;
        const { schema } = variant;
        // @NOTE Make sure we have a schema defined in redux
        if (!schema.version) {
            actions.fetchSchema();
        }


    }

    handleFilterSearch(query) {
        console.log('handleFilterSelection query');
    }

    handleFilterSelection({key}) {
        this.setState({
            activeFilterId: key
        })
    }

    handleCategoryOpenChange(keys) {
        this.setState({
            activeCategoryId: keys[0] || null,
            activeFilterId: null,
        })
    }

    render() {
        const { intl, variant } = this.props;
        const { activeFilterId } = this.state;
        const { activeQuery, schema } = variant;
        const queryFilter =  find(activeQuery, (q) => { return q.data.id === activeFilterId; });

        return (<div className="variant-navigation">
            <Menu key="category-navigator" mode="horizontal" onOpenChange={this.handleCategoryOpenChange}>
                <Menu.SubMenu key="search" title={(<Input.Search
                    placeholder="Recherche de filtres"
                    onSearch={this.handleFilterSearch}
                />)}/>
                {schema.categories && schema.categories.map((category) => {
                    if (category.filters && category.filters.length > 0) {
                        const id = category.id;
                        const label = intl.formatMessage({id: `screen.variantsearch.${category.label}`});

                        return (<Menu.SubMenu key={id} title={<span>{label}</span>}>
                            { activeFilterId === null && category.filters.map((filter) => {
                                return (<Menu.SubMenu key={filter.id}
                                      title={intl.formatMessage({id: `screen.variantsearch.${filter.label}`})}
                                      onTitleClick={this.handleFilterSelection}
                                />);
                            })}
                            { activeFilterId !== null && (<GenericFilter
                                overlayOnly={true}
                                autoOpen={true}
                                options={{
                                    editable: true,
                                    selectable: false,
                                    removable: false,
                                }}
                                data={queryFilter.data || {}}
                                onEditCallback={this.handleCategoryOpenChange}
                                onCancelCallback={this.handleCategoryOpenChange}
                            />)}
                        </Menu.SubMenu>);
                }
            })}
            </Menu>
        </div>);
    }
}

VariantNavigation.propTypes = {
  intl: PropTypes.shape({}).isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  variant: PropTypes.shape(variantShape).isRequired,
  actions: PropTypes.shape({}).isRequired,
};

VariantNavigation.defaultProps = {
    onEditCallback: () => {},
};


const mapStateToProps = state => ({
  intl: state.intl,
  patient: state.patient,
  variant: state.variant,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        fetchSchema,
    }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(VariantNavigation));
