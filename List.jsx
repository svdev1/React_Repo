/**
 * @author: Shaweta
 * @class: Home
 * @date:  29.08.2018
 * @time:  08:43
 * @scope:
 */

import Button                                                             from '@material-ui/core/Button/Button';
import React                                                              from 'react';
import { withRouter }                                                     from 'react-router';
import { Link }                                                           from 'react-router-dom';
import { CircularLoading }                                                from 'respinner';
import { BulletItem }                                                     from '../../../Components/BulletItem';
import { Col }                                                            from '../../../Components/Layout/Col';
import { Row }                                                            from '../../../Components/Layout/Row';
import { SearchBox }                                                      from '../../../Components/SearchBox';
import { Select }                                                         from '../../../Components/Select';
import { Trans }                                                          from '../../../Components/Trans';
import { connect }                                                        from '../../../lib/connect';
import withErrorHandling                                                  from '../../../lib/withErrorHandling';
import { productCreateRequest, productsGetRequest, productUpdateRequest } from '../../../redux/source/Products/actions';
import { Layout }                                                         from '../Components/Layout';
import { ListToolbar }                                                    from '../Components/ListToolbar';
import { Status }                                                         from '../Components/Status';
import ProductCard                                                        from './ProductCard';

interface ProductListInterface {

    items: array;

}

@withRouter
@connect({
    /** productsGetRequest */
    items:        'Products.items',
    pages:        'Products.pages',
    total:        'Products.total',
    params:       'Products.params',
    busy:         'Products.busy',
    error:        'Products.error',
    /** productCreateRequest */
    item_created: 'Products.item_created',
    create_busy:  'Products.item_create_busy',
}, {
    productsGetRequest,
    productCreateRequest,
    productUpdateRequest,
    // productUpdateDone,
})
@withErrorHandling({
    errors: [
        { id: 'error' }, // message
    ]
})
export default class List extends React.Component<ProductListInterface> {

    state = {
        status:               'all',
        progress:             'all',
        date:                 'all',
        table:                {
            limit:            5,
            page:             0,
            productBy:        '',
            productDirection: 'asc',
            selected:         [],
        },
        showAddProductDialog: false,
        items:                [],
    };

    constructor ( props ) {
        super(props);

        this.handleToolbarChange = this.handleToolbarChange.bind(this);
        this.onChangeTable       = this.onChangeTable.bind(this);

        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.buildLink        = this.buildLink.bind(this);
    }

    static getDerivedStateFromProps ( props, state ) {

        const newState = {};

        // If possible, set items from state, if not available take the loaded items from props
        if ( props.items && state.items.length === 0 ) {
            newState.items = props.items;
        } else {
            newState.items = state.items;
        }

        if ( props.item_created ) {

            props.history.push(`/apparel/products/${props.item_created.id}/edit`);
            // props.productUpdateDone();

        }

        return newState;
    }

    componentDidMount () {
        this.handleLoadProducts();
    }

    handleLoadProducts () {
        const { items, busy } = this.props;

        if ( (!items || items.size === 0) && !busy ) {
            this.props.productsGetRequest(this.state.table);
        }
    }

    handleToolbarChange ( state ) {
        this.setState(state);
    }

    handleAddProduct () {
        this.setState({
            redirectToEditPage: true
        });
        this.props.productCreateRequest();
    }

    buildLink ( id ) {
        return `/apparel/products/${id}`;
    }

    onChangeTable ( changeEvent ) {
        this.setState(
            {
                items: null,
                table: {
                    limit:            changeEvent.value.limit,
                    page:             changeEvent.value.page,
                    productBy:        changeEvent.value.productBy,
                    productDirection: changeEvent.value.productDirection,
                }
            },
            () => (
                this.props.productsGetRequest(this.state.table)
            )
        );
    }

    renderBreadCrumb () {
        return [
            <Link key={ 'br-link-products' }
                  to={ '/apparel/products' }>Products { this.props.total ? `(${this.props.total})` : '' }</Link>
        ];
    }

    /**
     *
     * @return {*}
     */
    render () {
        const { items } = this.state;

        return (
            <Layout title={ 'Products' } breadCrumb={ this.renderBreadCrumb() }>
                <ListToolbar defaultState={ this.state } onChange={ this.handleToolbarChange }>
                    <ListToolbar.Left>

                        <Select value={ this.state.status } name={ 'status' } label={ 'Status' }>
                            <BulletItem color={ 'dark' } value={ 'all' }>All</BulletItem>
                            <BulletItem color={ 'active' } value={ 'active' }>Active</BulletItem>
                            <BulletItem color={ 'warning' } value={ 'inactive' }>Inactive</BulletItem>
                        </Select>

                        <Select value={ this.state.progress } name={ 'progress' } label={ 'Progress' }>
                            <BulletItem value="all">All</BulletItem>
                            <BulletItem value="pre">Pre-Production</BulletItem>
                            <BulletItem value="prod">Production</BulletItem>
                            <BulletItem value="finished">Finished</BulletItem>
                        </Select>

                    </ListToolbar.Left>

                    <ListToolbar.Right>

                        <SearchBox value={ this.state.search } name={ 'search' } direction={ 'right' }
                                   label={ 'Product number or Org name' }/>

                        <Button variant={ 'contained' } color={ 'primary' } size={ 'large' }
                                disabled={ this.props.create_busy }
                                onClick={ this.handleAddProduct }>
                            <Trans>Add Product</Trans>

                            { this.props.create_busy ? <CircularLoading size={ 20 } stroke={ '#000' }/> : null }

                        </Button>

                    </ListToolbar.Right>
                </ListToolbar>

                <Row>
                    { items ?
                        items.map(( p ) => <Col lg={ 2 } md={ 3 } sm={ 4 } xs={ 6 } padding={ 8 }
                                                key={ p.id }><ProductCard product={ p }/></Col>) :
                        null
                    }
                </Row>

            </Layout>
        );
    }
}

List.displayName = 'List';
List.defaultProps = {
    items: [],
};
