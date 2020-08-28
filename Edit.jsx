/**
 * @author: Shaweta
 * @class: Home
 * @date:  29.08.2018
 * @time:  08:43
 * @scope:
 */
import MenuItem                                     from '@material-ui/core/MenuItem/MenuItem';
import Paper                                        from '@material-ui/core/Paper/Paper';
import Snackbar                                     from '@material-ui/core/Snackbar/Snackbar';
import TextField                                    from '@material-ui/core/TextField/TextField';
import Typography                                   from '@material-ui/core/Typography/Typography';
import PropTypes                                    from 'prop-types';
import React                                        from 'react';
import { withRouter }                               from 'react-router';
import { Link }                                     from 'react-router-dom';
import { CircularLoading }                          from 'respinner';
import styled, { withTheme }                        from 'styled-components';
import { OutlineSelect }                            from '../../../Components/Form/OutlineSelect';
import { Col }                                      from '../../../Components/Layout/Col';
import { Row }                                      from '../../../Components/Layout/Row';
import { SPaper }                                   from '../../../Components/SPaper';
import { SSnackbar }                                from '../../../Components/SSnackbar';
import { Trans }                                    from '../../../Components/Trans';
import { connect }                                  from '../../../lib/connect';
import { toggleElementInArray }                     from '../../../lib/utils';
import { Product }                                  from '../../../Models/Product';
import { factoriesGetRequest }                      from '../../../redux/source/Factories/actions';
import { productLoadRequest, productUpdateRequest } from '../../../redux/source/Products/actions';
import { Layout }                                   from '../Components/Layout';
import Button                                       from '@material-ui/core/Button/Button';
import Checkbox                                     from '@material-ui/core/Checkbox/Checkbox';
import Divider                                      from '@material-ui/core/Divider/Divider';
import InputAdornment                               from '@material-ui/core/InputAdornment/InputAdornment';
import FormControlLabel                             from '@material-ui/core/FormControlLabel/FormControlLabel';

const STextField          = styled(TextField)`

`;
const ProductImage        = styled.img`
    max-width: 100%;
    width: 100%;
    height: auto;
`;
const PaperHeadline       = styled(Typography)`
    font-size: 15px !important;
    font-weight: 400 !important;
    margin: 5px 0 10px 0 !important;
`;
const SDivider            = styled(Divider)`
    width: 100%;
    background-color: rgba(0, 0, 0, 0.23);
    margin: 20px 0 !important;
`;
const FactoryHeadlineCell = styled(Col)`
    color: rgba(0, 0, 0, 0.54);
`;

interface ProductEditInterface {

    item: object;

}

@withRouter
@withTheme
@connect({
    item:      'Products.item',
    item_busy: 'Products.item_busy',
    factories: 'Factories.items',
}, {
    productUpdateRequest,
    productLoadRequest,
    factoriesGetRequest,
})
export default class ProductEdit extends React.Component<ProductEditInterface> {

    state = {
        item:        new Product(),
        description: {},
        details:     [],
        saved:       false,
    };

    handlers = {
        item:        {},
        description: {},
        details:     {},
    };

    constructor ( props ) {
        super(props);

        // binds
        this.handleChange      = this.handleChange.bind(this);
        this.storeChange       = this.storeChange.bind(this);
        this.handleLoadProduct = this.handleLoadProduct.bind(this);
        this.handleSubmitOrder = this.handleSubmitOrder.bind(this);
    }

    static getDerivedStateFromProps ( props, state ) {

        const { item }        = props;
        const { item: $item } = state;

        if ( !$item.id && item ) {

            // Parse ids to integer that we can work easier with it,
            item.factory_ids = item.factory_ids.map(( f ) => parseInt(f));

            return {
                item:        $item.$fill(item),
                details:     item.details,
                description: item.description ? item.description : {},
            };
        }

        return state;
    }

    /**
     * Component mount event
     */
    componentDidMount () {

        const { item } = this.state;

        if ( !item.id ) {
            const itemId = this.props.match.params.product;

            this.setState({
                product_id: itemId,
            }, this.handleLoadProduct);
        }

        this.creatingNewDetailIfNecessary();

    }

    componentDidUpdate () {
        this.creatingNewDetailIfNecessary();
    }

    creatingNewDetailIfNecessary () {
        const { details } = this.state;
        const lastDetail  = details[ details.length - 1 ];

        if ( !lastDetail || (lastDetail.detail !== null && lastDetail.detail !== '') ) {

            this.setState({
                details: [ ...details, { detail: '' } ]
            });

        }

    }

    handleLoadProduct () {
        this.props.productLoadRequest(this.state.product_id);
        this.props.factoriesGetRequest();
    }

    /**
     * Memoize handle change
     * @return {*}
     * @param objectName
     * @param objectProp
     * @param targetProp @example value, checked
     * @param storeChange
     * @param idx
     */
    handleChange ( objectName, objectProp, idx = null, targetProp = 'value', storeChange = false, ) {

        const handlerProp = idx ? `${objectProp}_${idx}` : objectProp;

        if ( !this.handlers[ objectName ][ handlerProp ] ) {
            this.handlers[ objectName ][ handlerProp ] = ( { target } ) => {

                const object = this.state[ objectName ] || {};

                if ( idx !== null ) {
                    object[ idx ][ objectProp ] = target[ targetProp ];
                } else {
                    object[ objectProp ] = target[ targetProp ];
                }

                const cb = storeChange ? this.storeChange : () => {
                };

                this.setState({
                    [ objectName ]: object
                }, cb(objectName));

            };
        }

        return this.handlers[ objectName ][ handlerProp ];
    }

    handleCheckboxChange ( objectName, objectProp, value ) {

        const object         = this.state[ objectName ] || {};
        object[ objectProp ] = toggleElementInArray(object[ objectProp ], value);

        this.setState({
            [ objectName ]: object
        });

    }

    storeChange ( objectName, objectProp = null, idx = null ) {

        switch ( objectName ) {
            case 'item':
            case 'description':
            case 'details':
                this.props.productUpdateRequest({
                    ...this.state.item.$all(),
                    description: this.state.description,
                    details:     this.state.details
                });

                this.setState({
                    saved: true,
                });
                break;
            default:
                break;
        }

    };

    handleSubmitOrder () {

        // TODO: set stage or whatever and submit the product

    }

    /**
     * Render textfield, if colProps are given it will wrap the textfield with a <Col>
     * @param label
     * @param objectName
     * @param objectProp
     * @param idx
     * If the textfield is inside an array object, send the idx of array
     * @param colProps
     * Send at least {} and empty object for wrapping the TextField in <Col> </Col>
     * @param fieldProps
     * @return {*}
     */
    renderTextField ( label, objectName, objectProp, idx = null, colProps = null, fieldProps = {} ) {

        // Add the idx to id, that each array-item has its own ID
        const id = idx !== null ? `input_field_${objectProp}_${idx}` : `input_field_${objectProp}`;

        // Depending whether the property is an object, or array access the element
        const value = idx !== null ? this.state[ objectName ][ idx ][ objectProp ] || '' : this.state[ objectName ][ objectProp ] || '';

        const textField = (
            <STextField
                fullWidth={ true }
                id={ id }
                label={ label }
                value={ `${value}` }
                onChange={ this.handleChange(objectName, objectProp, idx) }
                // onBlur={ () => this.storeChange( objectName, objectProp, idx ) }
                margin="dense"
                variant="outlined"
                { ...fieldProps }
            />
        );

        if ( colProps !== null ) {
            return (
                <Col { ...colProps } key={ id }>
                    { textField }
                </Col>
            );
        } else {
            return textField;
        }

    }

    renderCheckboxField ( label, objectName, objectProp, value ) {

        const list    = this.state[ objectName ][ objectProp ] || false;
        const checked = list && list.filter(( v ) => parseInt(v) === parseInt(value)).length > 0;

        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={ checked }
                        onChange={ () => this.handleCheckboxChange(objectName, objectProp, value) }
                        value={ `${value}` }
                    />
                }
                label={ label }
            />
        );

    }

    renderBreadCrumb () {
        const { item } = this.state;
        const items    = [
            <Link key={ 'br-link-products' } to={ '/apparel/products' }>Products</Link>,
            <Link key={ 'br-link-products' } to={ '/apparel/products/' }>Products</Link>,
        ];

        if ( item ) {

            items.push(<Link key={ 'br-link-sales' }
                             to={ `/apparel/products/${item.id}` }>{ item.internal_id }</Link>);

            items.push(
                <Link key={ 'br-link-product-item' } to={ `/apparel/products/${item.id}/edit` }><Trans>Edit
                    Product</Trans></Link>
            );
        }

        return items;
    }

    renderProductDetails () {

        const { details } = this.state;

        return (
            <SPaper padding={ '14px 0' }>
                <Row>
                    <Col xs={ 12 } sm={ 4 }>
                        <div>
                            <ProductImage src={ 'https://via.placeholder.com/250x250' } alt={ 'hello you' }/>
                        </div>
                    </Col>
                    <Col xs={ 12 } sm={ 8 } padding={ 0 } alignItems={ 'flex-start' }>

                        { this.renderTextField('Product Name', 'item', 'name', null, { xs: 7, sm: 7 }) }
                        { this.renderTextField('Product ID', 'item', 'internal_id', null, { xs: 5, sm: 5 }) }
                        { this.renderTextField('Description', 'description', 'description', null, {
                            xs: 12,
                            sm: 12
                        }, { rowsMax: 4, multiline: true }) }

                    </Col>
                </Row>

                <Row direction={ 'row' } justify={ 'space-between' } align={ 'center' } wrap={ 'nowrap' }>
                    <Col xs={ 12 } sm={ 2 }>
                        <Typography><Trans>Sizing:</Trans></Typography>
                    </Col>
                    <Col xs={ 6 } sm={ 3 } padding={ 0 }>
                        { this.renderCheckboxField('Youth XS-XL', 'item', 'allowed_sizes', 'value') }
                    </Col>
                    <Col xs={ 6 } sm={ 3 } padding={ 0 }>
                        { this.renderCheckboxField('Adults XXS-4XL', 'item', 'allowed_sizes', 'value') }
                    </Col>
                    <Col xs={ 6 } sm={ 3 } padding={ 0 }>
                        { this.renderCheckboxField('XS-XXL', 'item', 'allowed_sizes', 'value') }
                    </Col>
                    <Col xs={ 6 } sm={ 3 } padding={ 0 }>
                        { this.renderCheckboxField('One Size Fits All', 'item', 'allowed_sizes', 'value') }
                    </Col>
                </Row>

                <Row><Col xs={ 12 } sm={ 12 }><SDivider/></Col></Row>

                <Row>
                    { details.map(( detail, idx ) => this.renderTextField(`Detail ${idx + 1}`, 'details', 'detail', idx, {})) }
                </Row>

            </SPaper>
        );

    }

    renderProductFactories () {

        const factories = this.props.factories || [];

        const factories$ = factories.map(( factory, key ) => (
            <Col xs={ 6 } sm={ 6 } key={ factory.id }>
                { this.renderCheckboxField(factory.name, 'item', 'factory_ids', factory.id) }
            </Col>
        ));

        return (
            <SPaper margin-left={ '-10px' }>
                <Row>
                    <Col xs={ 12 } sm={ 12 }>
                        <PaperHeadline variant={ 'h6' }>
                            Select factories that produce this:
                        </PaperHeadline>
                    </Col>

                    { factories$ }

                </Row>
            </SPaper>
        );

    }

    renderProductPricingBreakdown () {

        return (
            <SPaper margin-left={ '-10px' }>
                <Row>
                    <Col xs={ 12 } sm={ 12 }>
                        <PaperHeadline variant={ 'h6' }>
                            Select pricing / quantity breakdown
                        </PaperHeadline>

                        <OutlineSelect
                            fullWidth={ true }
                            id="pricing_id"
                            label="Pricing"
                            value={ 'A' }
                            // value={ this.state.item.pricing_id }
                            // onChange={ this.handleChange( 'item', 'pricing_id' ) }
                            margin="dense"
                            variant="outlined"
                        >

                            <MenuItem value={ 'A' }>A - 10-20 30-100 100-400</MenuItem>
                            <MenuItem value={ 'B' }>D - 10-60 60-100 100-400</MenuItem>
                            <MenuItem value={ 'C' }>V - 10-90 10-100 100-400</MenuItem>

                        </OutlineSelect>
                    </Col>
                </Row>
            </SPaper>
        );

    }

    renderProductWeight () {

        return (
            <SPaper margin-left={ '-10px' }>
                <Row>
                    <Col xs={ 12 } sm={ 12 }>
                        <PaperHeadline variant={ 'h6' }>
                            Enter shipping weight by unit
                        </PaperHeadline>

                        { this.renderTextField('Weight', 'item', 'weight', null, null, {
                            type:       'number',
                            InputProps: {
                                endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                            }
                        }) }
                    </Col>
                </Row>
            </SPaper>
        );

    }

    renderProductFactoryPricing () {

        const priceRanges = [
            '10-25 COST',
            '10-25 PRICE',
            '25-50 COST',
            '25-50 PRICE',
            '50-100 COST',
            '50-100 PRICE',
            '100-250 COST',
            '100-250 PRICE',
            '250+ COST',
            '250+ PRICE',
        ];

        const factories  = this.props.factories || [];
        const factories$ = factories.map(( factory ) => {
            return (
                <Row key={ factory.id }>
                    <Col xs={ 2 } sm={ 2 } justify={ 'start' } align={ 'center' }>
                        { factory.name }
                    </Col>

                    { priceRanges.map(( range, idx ) => this.renderTextField('', 'item', 'name' + idx, null, {
                        xs:      1,
                        sm:      1,
                        padding: '0 8px'
                    })) }

                </Row>
            );
        });

        return (
            <SPaper>
                <Row>
                    <FactoryHeadlineCell xs={ 2 } sm={ 2 } justify={ 'start' } align={ 'center' }>
                        Factory
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        10-25 <br/> COST
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        10-25 <br/> PRICE
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        25-50 <br/> COST
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        25-50 <br/> PRICE
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        50-100 <br/> COST
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        50-100 <br/> PRICE
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        100-250 <br/> COST
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        100-250 <br/> PRICE
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        250+ <br/> COST
                    </FactoryHeadlineCell>
                    <FactoryHeadlineCell xs={ 1 } sm={ 1 } align={ 'center' } justify={ 'center' } padding={ 8 }>
                        250+ <br/> PRICE
                    </FactoryHeadlineCell>
                </Row>

                { factories$ }

            </SPaper>
        );

    }

    /**
     *
     * @return {*}
     */
    renderContent () {

        const renderProductDetails$          = this.renderProductDetails();
        const renderProductFactories$        = this.renderProductFactories();
        const renderProductPricingBreakdown$ = this.renderProductPricingBreakdown();
        const renderProductWeight$           = this.renderProductWeight();
        const renderProductFactoryPricing$   = this.renderProductFactoryPricing();

        return (
            <div>
                <Row>
                    <Col xs={ 12 } sm={ 8 }>
                        { renderProductDetails$ }
                    </Col>
                    <Col xs={ 12 } sm={ 4 } align={ 'flex-start' } justify={ 'flex-start' }>
                        { renderProductFactories$ }
                        { renderProductPricingBreakdown$ }
                        { renderProductWeight$ }
                    </Col>
                </Row>
                <Row>
                    <Col xs={ 12 } sm={ 12 }>
                        { renderProductFactoryPricing$ }
                    </Col>
                </Row>
                <Row>
                    <Col xs={ 12 } sm={ 12 } padding={ 32 }>
                        <Button variant={ 'contained' } color={ 'primary' }
                                onClick={ () => this.storeChange('item') }><Trans>SAVE CHANGES</Trans></Button>
                        <Button href={ `/apparel/products/${this.state.item.id}` }><Trans>GO BACK</Trans></Button>
                    </Col>
                </Row>

                <SSnackbar open={ this.state.saved }
                           onClose={ ( event, reason ) => this.setState({ saved: false }) }
                           variant={ 'success' }
                           message={ 'Product stored' }/>
            </div>
        );
    }

    renderLoading () {
        const { theme } = this.props;
        return (
            <Row align={ 'center' } justify={ 'center' } style={ { padding: 40 } }>
                <CircularLoading stroke={ theme.colors.accent }/>
            </Row>
        );
    }

    /**
     * Render Order Component
     */
    render () {
        const { item } = this.state;

        return (
            <Layout title={ 'Create Order' } background={ '#eee' } breadCrumb={ this.renderBreadCrumb() }>
                { item ? (
                    this.renderContent()
                ) : (
                    this.renderLoading()
                ) }
            </Layout>
        );
    }

}

ProductEdit.displayName = 'ProductEdit';
ProductEdit.defaultProps = {
    item: {},
};
