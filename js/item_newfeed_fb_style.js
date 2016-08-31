$(document).ready(function(){
    $('.box-image').each(function() {
        $this = $(this);
        $(this).height($(this).width() / (700/575));
        var data = JSON.parse($(this).find('.json').text());

        $.each(data, function(index, vl) {
            if (index <= 4) {
                $this.append('<span class="wrap-img item_' + (index + 1) + '"><span class="bg" style="background-image: url(' + vl.image_url + ')"></span></span>');
            } else {
                $this.append('<span class="mark-plus wrap-img"><span class="bg">+'+ (data.length - 5) +'</span></span>');
                return false;
            }

        });

        if (data.length <= 4) {
            $this.addClass('layout-' + data.length);
        } else {
            $this.addClass('layout-5');
        }
        $this.addClass('layout-ori-' + data.length);

    });

    $('.create-content-more').each(function() {
        $this = $(this);
        var content = $this.find('.json').html();
        var out = '';
        if (content.split(' ').length > 14) {
            $.each(content.split(' '), function(index, vl) {
                out += vl + ' ';
                if (index == 13) {
                    out += '<span class="more">';
                }
            });
            out += '</span><a href="" class="open-readmore">Xem thêm</a>';
            $this.html(out);
        } else {
            $this.html(content);
        }
    });

    $('.create-content-more').on('click', '.open-readmore', function(event) {
        event.preventDefault();
        $(this).closest('.create-content-more').addClass('opening');
    });
}).on('click', '.btn-cancel-fancybox', function(event) {
    event.preventDefault();
    $.fancybox.close();
});


var Action = {
    report: function(obj_Article){
        if (obj_Article.id != '') {
            $.fancybox({
                type: 'html',
                content: Template.report(obj_Article.id)
            });
        }
    },
    reportCheckType: function(el) {
        $this = $(el);
        console.log($this.val());
        if ($this.val() == 5) {
            $(el).closest('form').find('.content-other').removeClass('hidden');
        } else{
            $(el).closest('form').find('.content-other').addClass('hidden');
        }
    },
    like : function(id){

    },
    comment: function(obj_Article){
        if (obj_Article.id != '') {
            $.fancybox({
                type: 'html',
                content: Template.comment(obj_Article)
            });
        }
    },
    submitReport: function(el){
        $this = $(el);
        var data = $this.serialize();
        $this.find('[type="submit"]').text('Đang gửi...');

        $.post(configJson.urlAddReport, data, function(data){

            if (data.status == configJson.STATUS_CODE_SUCCESS) {
                $cir = $(Template.circleComplete());
                $this.html($cir);
                setTimeout(function(){
                    $this.find('.cp').addClass('active');
                }, 100);
                $(document).find('.info-report').text(data.message);
                $.fancybox.update();

            } else if (data.status == configJson.STATUS_CODE_UNAUTHORIZED) {
                alert(data.message);
                $this.find('[type="submit"]').text('Gửi');
                window.location.href = data.result.redirect_url;
            } else {
                alert(data.message);
                $this.find('[type="submit"]').text('Gửi');
            }
        }, 'json');
    },
    submitComment: function(el){
        $this = $(el);
        var data = $this.serialize();
        $this.find('[type="submit"]').text('Đang gửi...');

        $.post(configJson.urlAddComment, data, function(data){
            if (data.status == configJson.STATUS_CODE_SUCCESS) {
                $cir = $(Template.circleComplete());
                $this.html($cir);
                setTimeout(function(){
                    $this.find('.cp').addClass('active');
                }, 100);
                $(document).find('.info-report').text(data.message);
                $.fancybox.update();

            } else if (data.status == configJson.STATUS_CODE_UNAUTHORIZED) {
                alert(data.message);
                window.location.href = data.result.redirect_url;
            } else {
                alert(data.message);
                $this.find('[type="submit"]').text('Gửi');
            }
        }, 'json');
    }
}

var Template = {
    report: function(id) {
        var html = nanoTemplate('<div id="single-page" class="single-page"><h1 class="title-contact">Cảm ơn bạn đã góp ý</h1><div class="wysiwyg-content"><div class="wrap-user edit n-p report-page"><div class="info-report"><div><i>Bạn vui lòng cung cấp thông tin chi tiết để chúng ta cùng nhau xây dựng môi trường Mua Bán Nhanh trong sạch hiệu quả.</i><br><br></div></div><div class="block-info-user"><div class="mess-report"></div><form onsubmit="Action.submitReport(this); return false;" action="" id="form_report" class="form-report form-style1"><div class="entry"><p><span class="text">Chọn lý do báo cáo <span class="text-danger">*</span></span><select onchange="Action.reportCheckType(this)" required class="style1" name="type" id="type"><option value="">Chọn kiểu sai phạm </option><option value="1">Lừa đảo</option><option value="2">Sai chuyên mục</option><option value="3">Giá không đúng nêm yết</option><option value="4">Mạo danh</option><option value="6">Tin bị trùng với tin đã có</option><option value="7">Không liên hệ được với người đăng tin</option><option value="5">Khác</option></select></p><p class="hidden content-other"><span class="text">Nội dung báo cáo</span><textarea name="content" id="" rows="3" placeholder="Nhập nội dung báo cáo"></textarea></p><p><span class="text">Danh xưng <span class="text-danger">*</span></span><input required  type="text" placeholder="Họ và tên" name="name" id="name" value=""></p><p><span class="text">Số điện thoại <span class="text-danger">*</span></span><input required  type="text" id="phone" name="phone" value="" placeholder="Nhập số điện thoại"></p><p><span class="text">Email(nếu có)</span><input type="text" id="email" placeholder="Nhập email (nếu có)" name="email" value=""></p><div class="text-right button-report"><a href="" class="btn-cancel-fancybox btn btn-default btn-sm">Hủy</a><button type="submit" class="btn btn-sm btn-success">Gửi </button></div><input type="hidden" name="id" value="{id}"></div></form></div></div></div></div>', {'id': id});
        return html;
    },
    comment: function(obj_Article) {
        var html = nanoTemplate('\
            <div id="single-page" class="single-page">\
                <h1 class="title-contact">Khiếu nại/Trả giá</h1>\
                <div class="wysiwyg-content">\
                    <div class="wrap-user n-p">\
                        <div class="info-report">\
                            <div><i>\
                                Bạn đang khiếu nại/trả giá sản phẩm:\
                                </i><b>{name}</b>\
                            </div>\
                            <p style="padding-bottom: 0"><b>Giá: <span class="text-red">{price}</span></b></p>\
                        </div>\
                        <div class="block-info-user">\
                            <div class="mess-report"></div>\
                            <form action="" onsubmit="Action.submitComment(this); return false;" id="form_comment" class="form-comment form-style1">\
                                <div class="entry">\
                                    <p class=""><span class="text">Nội dung</span>\
                                      <textarea name="description" id="" rows="3" placeholder="Nhập nội dung"></textarea>\
                                    </p>\
                                    <div class="text-right button-report">\
                                      <a href="" class="btn-cancel-fancybox btn btn-default btn-sm">Hủy</a>\
                                      <button class="btn btn-sm btn-success">Gửi </button>\
                                    </div>\
                                  <input type="hidden" name="article_id" value="{id}">\
                                  <input type="hidden" name="phone" value="{phone}">\
                              </div>\
                            </form>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        ', obj_Article);
        return html;
    },

    circleComplete: function(){
        return '<div class="cp"><div class="check"></div></div>';
    }
}
