/**
 * @author: Shaweta
 * @class: Order
 * @date:  30.09.2018
 * @time:  16:50
 * @scope:
 */
import React                 from 'react';
import { CircularLoading }   from 'respinner';
import styled, { withTheme } from 'styled-components';
import { Col }               from '../../../Components/Layout/Col';
import { Row }               from '../../../Components/Layout/Row';
import { Product }           from '../../../Models/Product';
import Button                from '@material-ui/core/Button/Button';
import Card                  from '@material-ui/core/Card/Card';
import CardActionArea        from '@material-ui/core/CardActionArea/CardActionArea';
import CardActions           from '@material-ui/core/CardActions/CardActions';
import CardContent           from '@material-ui/core/CardContent/CardContent';
import CardMedia             from '@material-ui/core/CardMedia/CardMedia';
import Typography            from '@material-ui/core/Typography/Typography';

const SCard = styled(Card)`
    max-width: 100%;
    width: 100%;
`;

const SCardMedia = styled(CardMedia)`
    height: 200px;
`;

const SCardContent = styled(CardContent)`
    padding: 15px 10px !important;
`;

const STypoProductName = styled(Typography)`
    font-size: 15px !important;
`;

const STypoDescription = styled(Typography)`
    font-size: 14px !important;
    color: #444;
`;

const SButton = styled(Button)`
    font-size: 16px !important;
`;


interface ProductCardInterface {

    product: object;

}

@withTheme
export default class ProductCard extends React.PureComponent<ProductCardInterface> {

    state = {
        product: new Product(),
    };

    /**
     * Component mount event
     */
    componentDidMount () {

    }

    renderContent () {
        const { product } = this.props;

        return (
            <SCard>
                <CardActionArea href={ `/apparel/products/${product.id}` }>
                    <SCardMedia
                        image="https://via.placeholder.com/250x250"
                        title="Contemplative Reptile"
                    />
                    <SCardContent>
                        <STypoProductName variant="h6">
                            { product.name }
                        </STypoProductName>
                        <STypoDescription component="p" noWrap={ true }>
                            Bejing Fabrics, AM Goods +3 more
                        </STypoDescription>
                    </SCardContent>
                </CardActionArea>
                <CardActions disableActionSpacing={ true }>
                    <Col xs={ 12 } md={ 12 } align={ 'end' } justify={ 'end' } padding={ 0 }>
                        <SButton size="small" color="primary">
                            { product.internal_id }
                        </SButton>
                    </Col>
                </CardActions>
            </SCard>
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
     * Render Orders Component
     */
    render () {
        const { product } = this.state;

        return product ? this.renderContent() : this.renderLoading();
    }
}

ProductCard.displayName = 'ProductCard';
ProductCard.defaultProps = {
    product: {},
};
