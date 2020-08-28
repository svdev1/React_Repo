/**
 * @author: Shaweta
 * @class: Order
 * @date:  30.09.2018
 * @time:  16:50
 * @scope:
 */
import React                  from 'react';
import { withRouter }         from 'react-router';
import { Link }               from 'react-router-dom';
import { CircularLoading }    from 'respinner';
import styled, { withTheme }  from 'styled-components';
import { Col }                from '../../../Components/Layout/Col';
import { Row }                from '../../../Components/Layout/Row';
import { SPaper }             from '../../../Components/SPaper';
import { Trans }              from '../../../Components/Trans';
import { connect }            from '../../../lib/connect';
import { Product }            from '../../../Models/Product';
import { productLoadRequest } from '../../../redux/source/Products/actions';
import Layout                 from '../Components/Layout';
import Button                 from '@material-ui/core/Button/Button';
import Divider                from '@material-ui/core/Divider/Divider';
import Typography             from '@material-ui/core/Typography/Typography';

const PaperHeadline       = styled(Typography)`
    font-size: 15px !important;
    font-weight: 400 !important;
    margin: 5px 0 10px 0 !important;
    
    .note {
        color: #999;
        margin-left: 10px;
        font-weight: 400;
    }
    
`;
const FactoryHeadlineCell = styled(Col)`
    color: rgba(0, 0, 0, 0.54);
`;
const SDivider            = styled(Divider)`
    width: 100%;
    margin: 10px 0 !important;
`;
const ProductImage        = styled.img`
    max-width: 100%;
    width: 100%;
    height: auto;
`;

const TypographyHeadline    = styled(Typography)`
    margin-bottom: 5px !important;
    flex: 1;
`;
const TypographySubheadline = styled(Typography)`
    font-size: 15px !important;
    font-weight: 400 !important;
    margin-top: 0px !important;
    flex: 1;
    color: #999 !important;
`;
const TypographyDescription = styled(Typography)`
    flex: 1;
    color: #999 !important;
    font-size: 14px !important;
`;
const List                  = styled.ul`
    margin-left: 0px;
    padding-left: 30px;
    
    li {
        color: #999;
    }
`;

const FactoryLine = styled(Row)`
    margin: 0 10px;
    width: calc(100% - 20px) !important;
    
    ${Col} {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
    }
    
    &:nth-last-child(1) {
        ${Col} {
            border-bottom: 0px;
        }
    }
   
`;

@withRouter
@withTheme
@connect({
    item: 'Products.item',
}, {
    productLoadRequest,
})
export default class View extends React.PureComponent {

    constructor ( props ) {
        super(props);

        this.handleLoadProduct();
    }

    handleLoadProduct () {

        if ( !this.props.item ) {
            const itemId = this.props.match.params.product;
            this.props.productLoadRequest(itemId);
        }

    }

    renderBreadCrumb () {

        const { item } = this.props;

        const items = [
            <Link key={ 'br-link-sales' } to={ '/apparel/products' }>Products</Link>,
        ];

        if ( item ) {
            items.push(<Link key={ 'br-link-sales' } to={ `/apparel/products/${item.id}` }>{ item.internal_id }</Link>);
        }

        return items;

    }

    renderProductBasics () {

        const { item } = this.props;

        return (
            <SPaper padding={ '14px 0' }>
                <Row>
                    <Col xs={ 12 } sm={ 4 }>
                        <div>
                            <ProductImage src={ 'https://via.placeholder.com/250x250' } alt={ 'hello you' }/>
                        </div>
                    </Col>
                    <Col xs={ 12 } sm={ 8 } direction={ 'column' }>

                        <TypographyHeadline variant={ 'h5' }>
                            { item.name }
                        </TypographyHeadline>
                        <TypographySubheadline variant={ 'h6' }>
                            { item.internal_id } | XS-XL | Youth | Adults
                        </TypographySubheadline>

                        <SDivider/>

                        <TypographyDescription variant={ 'body1' } paragraph={ true }>
                            { item.description ? item.description.description : '' }
                        </TypographyDescription>

                        <div>
                            <Button variant={ 'contained' } color={ 'primary' } href={ `/apparel/products/${item.id}/edit` }>
                                <Trans>EDIT DETAILS</Trans>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </SPaper>
        );

    }

    renderProductDetails () {

        const details = this.props.item.details || [];

        const details$ = details.map(( detail ) => {

            if ( detail.detail !== '' ) {
                return (
                    <li key={ detail.id }>
                        { detail.detail }
                    </li>
                );
            }
            return null;
        });

        return (
            <SPaper marginLeft={ '-5px' }>
                <Row>
                    <Col xs={ 12 } sm={ 12 }>
                        <PaperHeadline variant={ 'h6' }>
                            Details
                        </PaperHeadline>
                    </Col>

                    <List>
                        { details$ }
                    </List>

                </Row>
            </SPaper>
        );

    }

    renderProductWeight () {

        return (
            <SPaper marginLeft={ '-5px' }>
                <Row>
                    <Col xs={ 12 } sm={ 12 }>
                        <PaperHeadline variant={ 'h6' }>
                            Shipping Weight: <span className={ 'note' }>{ this.props.item.weight } lbs</span>
                        </PaperHeadline>
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

        const factories  = this.props.item.factories || [];
        const factories$ = factories.map(( factory ) => {
            return (
                <FactoryLine key={ factory.id }>
                    <Col xs={ 2 } sm={ 2 } justify={ 'start' } align={ 'center' }>
                        { factory.name }
                    </Col>

                    { priceRanges.map(( range, idx ) => (
                        <Col key={ `${factory.id}_${idx}` } xs={ 1 } sm={ 1 } align={ 'center' }
                             justify={ 'center' }> $ { Math.floor(Math.random() * 100) + 10 }.00 </Col>)) }

                </FactoryLine>
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

        const renderProductBasics$         = this.renderProductBasics();
        const renderProductDetails$        = this.renderProductDetails();
        const renderProductWeight$         = this.renderProductWeight();
        const renderProductFactoryPricing$ = this.renderProductFactoryPricing();

        return (
            <div>
                <Row>
                    <Col xs={ 12 } sm={ 8 }>
                        { renderProductBasics$ }
                    </Col>
                    <Col xs={ 12 } sm={ 4 } align={ 'flex-start' } justify={ 'flex-start' }>
                        { renderProductDetails$ }
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
                        <Button href={ '/apparel/products' }><Trans>BACK TO LIST</Trans></Button>
                    </Col>
                </Row>
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
        const { item } = this.props;

        return (
            <Layout title={ 'Product' } background={ '#eee' } breadCrumb={ this.renderBreadCrumb() }>
                { item ? (
                    this.renderContent()
                ) : (
                    this.renderLoading()
                ) }
            </Layout>
        );
    }

}

View.displayName = 'ProductView';
