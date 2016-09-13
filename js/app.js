"use strict"

var LabelUserComponent = React.createClass({
    render: function(){
        var data = this.props.info;
        var html = false;
        if ( data.membership_value == 21 ) {
            html = false;
        } else {
            html = <span className={ data.membership + ' label-premium' }>{ data.membership } { data.vip_type > 0 ? data.vip_type : '' }</span>;
        }

        return (
            html
        );
    }
});

var HeaderItemBoxComponent = React.createClass({
    render: function() {

        var thumbnailStyle = {
            backgroundImage: 'url('+ this.props.dataSource.user.avatar_url +')'
        };

        var info = {
            membership_value: this.props.dataSource.user.membership_value,
            membership: this.props.dataSource.user.membership,
            vip_type: this.props.dataSource.user.vip_type
        };

        return (
            <div className="header-box">
                <div className="thumbnail" style={ thumbnailStyle }>
                </div>
                <div className="summary">
                    <a href={ this.props.dataSource.user.url } title={ this.props.dataSource.user.name }>
                        <span className="username"> { this.props.dataSource.user.name } </span>
                    </a>
                    <div className="rating-content">
                        <span className="rating-start">
                            <span className="rating-start5"></span>
                        </span>
                    </div>
                    <div className="meta">
                        { this.props.dataSource.updated_at }  -
                        <LabelUserComponent info={ info } />
                        <a href={ this.props.dataSource.category.url } title={ this.props.dataSource.category.url }> { this.props.dataSource.category.name } </a>
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

var FooterItemBoxComponent = React.createClass({
    render: function() {
        return (
            <div className="box-footer">
                <div className="pull-left">
                    <a href="" className="btn-report f-item">
                        <span className="fa fa-exclamation-triangle text-yellow"></span> Báo cáo
                    </a>
                    <a href="" className="btn-favorite f-item">
                        <span className="fa fa-heart-o"></span>
                        Thích</a>
                    <a href="" className="btn-comment f-item">
                        <span className="fa fa-commenting"></span> Trả giá</a>
                </div>
                <div className="pull-right">
                    <a href="sms: item['user']['phone_number'] ~ symbol ~ item['url'] ~ ' Hoi: ' " className="sms f-item">SMS</a>
                    <a href="tel: item['user']['phone_number'] " className="call-now f-item">Gọi ngay</a>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

var ContentItemBoxComponent = React.createClass({
    createContent: function(content){
        var out = '';
        if (content.split(' ').length > 14) {
            $.each(content.split(' '), function(index, vl) {
                out += vl + ' ';
                if (index == 13) {
                    out += '<span class="more">';
                }
            });
            out += '</span><a href="" class="open-readmore">Xem thêm</a>';
        } else {
            out = content;
        }

        return out;
    },
    createImage: function(data){
        // <div className="box-image">
        //

        var out = '';
        $.each(data, function(index, vl) {
            if (index <= 4) {
                var bgStyle = {
                    backgroundImage: 'url('+ vl.image_url +')'
                };
                out += <span className={ 'wrap-img item_' + (index + 1) }><span className="bg" style={bgStyle}></span></span>;
            } else {
                out += <span className="mark-plus wrap-img"><span className="bg">{ data.length - 5 }</span></span>;
                return false;
            }
        });

        return out;
    },
    render: function() {
        var item = this.props.dataSource;
        return (
            <div className="block-summary">
                <a href={ item.url } title={ item.name }><h4 className="title-post"> { item.name } </h4></a>
                <div className="box-price">
                    <div className="price-old"> { item.price_old } <sup>VND</sup></div>
                    <div className="price-new">{ item.price }</div>
                </div>
                <div className="address">
                    <span className="fa fa-map-marker">  { item.address } </span>
                </div>
                <div className="content create-content-more">
                    <span className="json no-display" dangerouslySetInnerHTML={{ __html: this.createContent(item.description.replace(/\n/g,"<br>")) }}></span>
                </div>

                { this.createImage(JSON.stringify(item.gallery)) }

                <div className="meta-bottom">
                    <div className="pull-left">
                        <div className="box-price">
                                <div className="price-new"> { item.price }  <sup>VND</sup></div>
                        </div>
                    </div>
                    <div className="pull-right">
                         { item.view_count }  Đã xem chi tiết
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
})

var ArticleItemBoxComponent = React.createClass({
    render: function() {
        return (
            <li key={ this.props.dataSource.id } className="item">
                <div className="entry">
                    <HeaderItemBoxComponent dataSource={ this.props.dataSource }/>

                    <ContentItemBoxComponent dataSource={ this.props.dataSource }/>

                    <FooterItemBoxComponent dataSource={ this.props.dataSource }/>
                </div>
            </li>
        );
    }
});

var ArticleBox = React.createClass({
    getInitialState: function() {
        return {
            source: {},
            loading: true
        };
    },

    componentDidMount: function() {
        var self = this;
        $.get(self.props.urlData, function(res){
            if (self.isMounted()) {
                self.setState({
                    'source': res,
                    'loading': false
                });
            }
        }.bind(this));
    },

    render: function() {
        var ArticleItemBoxComponent = '';

        if (this.state.loading == false) {
            ArticleItemBoxComponent = this.state.source.hits.hits.map(function(article){
                return (<ArticleItemBoxComponent key={ article._source.id } dataSource={ article._source } />);
            });
        }

        return (
            <ul className="list-unstyled item-fb-newsfeed">
                { ArticleItemBoxComponent }
            </ul>
        );
    }
});

ReactDOM.render(
    <ArticleBox urlData="data/result.json" />,
    document.getElementById('example')
);

