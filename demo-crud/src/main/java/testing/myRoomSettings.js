"use strict";
var tabs, log, token, rd, roomAccess, premiumSettings, admins, timeout, xhr = null, tab_detail = "detail", tab_access = "access", tab_admins = "admins", tab_settings = "settings", src_delete_photo = "delete-photo", src_delete_admin = "delete-admin", src_delete_admin_v2 = "delete-admin-v2", src_edit_admin = "edit-admin", src_manage_admins = "manage-admins", src_admin_monitor = "admin-monitor", msg_success = "Room Profile saved. Please allow 1 minutes for your room changes to take effect.", msg_success_access = "Room Settings saved. Please allow 1 minutes for your room changes to take effect.", msg_success_premium = "Premium Room Settings saved. Please allow 1 minutes for your room changes to take effect.", msg_form_validation_err = "Please correct all above highlighted error(s) and try again.", msg_err_inactive = "Your room is currently deactivated. To change settings, you must re-activate your room.", msg_err_dirty = "Oops! It doesn't look like you have any changes to submit", msg_err_general = "An unexpected error occurred. Please refresh the page and try again or contact Paltalk Support.", msg_err_request_timeout = "Sorry! We are unable to process your request. Please refresh the page and try again or contact paltalk support.", confirm_modal_txt_admin_monitor = "Do you want to save changes you made to Enable Admin Monitor setting?", confirm_modal_txt_manage_admins = "Do you want to save changes you made to Who can manage admins setting?", phName = "Type a name here...", phDesc = "Type a description here...", phIntroMsg = "Type a welcome msg here...", RoomDetails = function() {
    var g = this;
    this.get_catg_no_img_base_url = function() {
        var e = $("#input-hidden-catg-icon-url").val();
        return log.info("catg_no_img_base_url=" + e),
            e
    }
        ,
        this.getName = function() {
            var e = $("#input-txt-room-name").val();
            return log.info("getName=" + e),
                e
        }
        ,
        this.getDesc = function() {
            var e = $("#input-txt-room-desc").val();
            return log.info("getDesc=" + e),
                e.trim()
        }
        ,
        this.getWelcomeMsg = function() {
            var e = $("#input-txt-room-intro").val();
            return log.info("getWelcomeMsg=" + e),
                e.trim()
        }
        ,
        this.getCategory = function() {
            var e = $("#dd-catg").val();
            return log.info("getCategory=" + e),
                NaN !== parseInt(e) ? parseInt(e) : 0
        }
        ,
        this.getCategoryName = function() {
            var e = $("#dd-catg option:selected").text();
            return log.info("getCategoryName=" + e),
                e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getSubCategory = function() {
            var e = $("#dd-subcatg").val();
            return log.info("getSubCategory=" + e),
                NaN !== parseInt(e) ? parseInt(e) : 0
        }
        ,
        this.getSubCategoryName = function() {
            var e = $("#dd-subcatg option:selected").text();
            return log.info("getSubCategoryName=" + e),
                e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getLanguage = function() {
            var e = $("#dd-lang").val();
            return log.info("getLanguage=" + e),
                parseInt(e)
        }
        ,
        this.getLanguageName = function() {
            var e = $("#dd-lang option:selected").text();
            return log.info("getLanguageName=" + e),
                e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getRating = function() {
            var e = $("#dd-rating").val();
            return log.info("getRating=" + e),
                e
        }
        ,
        this.getRatingDesc = function() {
            var e = $("#dd-rating option:selected").text();
            return log.info("getRatingDesc=" + e),
                e.trim()
        }
        ,
        this.getInactive = function() {
            var e = "N";
            return $(".round-checkbox").hasClass("on") && (e = "Y"),
                log.info("getInactive=" + e),
                e.trim()
        }
        ,
        this.getInactiveOrg = function() {
            var e = (e = $("#input-hidden-inactive").val()) && void 0 !== e ? e : "";
            return log.info("getInactiveOrg=" + e),
                e
        }
        ,
        this.getPhotoName = function() {
            var e = void 0 !== (e = $(".profile-pic").attr("data-photo-name")) && 0 < e.trim().length && "catg-icon.jpg" !== e ? e : "";
            return log.info("getPhotoName=" + e),
                e
        }
        ,
        this.getPhotoUrl = function() {
            var e = $(".profile-pic").find("img").attr("src");
            return log.info("getPhotoUrl=" + e),
                void 0 !== e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getUuid = function() {
            var e = $(".profile-pic").attr("data-uuid");
            return void 0 !== e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getCrop = function() {
            var e = $(".profile-pic").attr("data-crop");
            return void 0 !== e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getSmallerImage = function() {
            var e = $(".profile-pic").attr("data-smallerImage");
            return void 0 !== e && 0 < e.trim().length ? e : "f"
        }
        ,
        this.getPhotoRef = function() {
            var e = $(".profile-pic").attr("data-ref");
            return void 0 !== e && 0 < e.trim().length ? parseInt(e) : 0
        }
        ,
        this.updateCharCount = function(e, t) {
            $("#" + e).find("span.char_count").html(t + " characters left")
        }
        ,
        this.setCleanData = function() {
            g.clean_data = {
                name: g.getName(),
                desc: g.getDesc(),
                welcome_msg: g.getWelcomeMsg(),
                category: g.getCategory(),
                category_name: g.getCategoryName(),
                subcategory: g.getSubCategory(),
                subcategory_name: g.getSubCategoryName(),
                lang: g.getLanguage(),
                lang_name: g.getLanguageName(),
                rating: g.getRating(),
                rating_desc: g.getRatingDesc(),
                inactive: g.getInactive(),
                photo_name: g.getPhotoName(),
                photo_url: g.getPhotoUrl()
            }
        }
        ,
        this.resetOnCancel = function() {
            $(".profile-pic").attr("data-photo-name", g.clean_data.photo_name),
                $(".profile-pic").find("img").attr("src", g.clean_data.photo_url),
                g.setTVBackGround(),
                $("#input-txt-room-name").val(g.clean_data.name),
                g.updateCharCount("sec0", 50 - $("#input-txt-room-name").val().length),
                $("#input-txt-room-desc").val(g.clean_data.desc),
                g.updateCharCount("sec3", 128 - $("#input-txt-room-desc").val().length),
                $("#input-txt-room-intro").val(g.clean_data.welcome_msg),
                g.updateCharCount("sec4", 255 - $("#input-txt-room-intro").val().length),
                $("#dd-catg").val(g.clean_data.category).trigger("change"),
                $("#dd-catg").attr("data-value", g.clean_data.category),
                g.getSubCategories(g.clean_data.category).done(function(e) {
                    $("#dd-subcatg").val(g.clean_data.subcategory).trigger("change"),
                        $("#dd-subcatg").attr("data-value", g.clean_data.subcategory)
                }),
                $("#dd-lang").val(g.clean_data.lang).trigger("change"),
                $("#dd-lang").attr("data-value", g.clean_data.lang),
                rd.set_rating_data(),
                $("#dd-rating").val(g.clean_data.rating).trigger("change"),
                $("#dd-rating").attr("data-value", g.clean_data.rating),
                "Y" === g.clean_data.inactive ? $(".round-checkbox").addClass("on").removeClass("off") : $(".round-checkbox").addClass("off").removeClass("on"),
                rd.setTBState()
        }
        ,
        this.hideErrorOnSection = function(e) {
            void 0 !== e && "" !== e && ($("#" + e).find("p.error-msg").addClass("hide"),
                "sec0" === e || "sec3" === e || "sec4" === e ? $("#" + e).find(".textarea").removeClass("error") : "sec5" !== e && "sec6" !== e && "sec7" !== e && "sec8" !== e || $("#" + e).find(".wrapper-dropdown").removeClass("error"))
        }
        ,
        this.showErrorOnSection = function(e, t) {
            void 0 !== e && "" !== e && "" !== t && $("#" + e).find("p.error-msg").html(t).removeClass("hide"),
                "sec0" === e || "sec3" === e || "sec4" === e ? $("#" + e).find(".textarea").addClass("error") : "sec5" !== e && "sec6" !== e && "sec7" !== e && "sec8" !== e || $("#" + e).find(".wrapper-dropdown").addClass("error")
        }
        ,
        this.photoError = function(e) {
            $("#sec10").find("a.delete-pic").removeClass("hide"),
                $("#sec10").find("p.error-msg").html("").addClass("hide"),
            void 0 !== e && "" !== e && ($("#sec10").find("a.delete-pic").addClass("hide"),
                $("#sec10").find("p.error-msg").html(e).removeClass("hide"))
        }
        ,
        this.resetSubCategorySB = function() {
            $("#dd-subcatg").select2("val", "0")
        }
        ,
        this.getSubCategories = function(e) {
            log.info("getSubCategories, catgId=" + e);
            var t, a = $.Deferred(), i = "", n = "RequestId=MyPalTalk.LoadSubCategories&catg=" + e;
            return log.info("getSubCategories, dataURL=" + n),
                0 < e ? null == xhr && (xhr = $.ajax({
                    url: "/mpt/ControllerServlet",
                    contentType: "application/json",
                    data: n,
                    success: function(e) {
                        xhr = null,
                            e.success ? "" !== (t = e.subcategories) && 0 < t.length ? (i += '<option value="0" data-value="0" selected="selected">Select</option>',
                                $.each(t, function(e, t) {
                                    i += '<option value="' + t.subcategory + '" data-value="' + t.subcategory + '">' + t.name + "</option>"
                                }),
                                $("#dd-subcatg").empty().append(i),
                                a.resolve({})) : (log.error("getSubcategories, no items found for category"),
                                a.reject) : (log.error("getSubcategories, ajax response failed"),
                                a.reject)
                    },
                    error: function(e) {
                        xhr = null,
                            console.error(e)
                    }
                })) : log.error("getSubcategories, Not a valid category id. " + e),
                a.promise()
        }
        ,
        this.setUCData = function(e, t, a, i, n) {
            e = e && 0 < parseInt(e) ? parseInt(e) : "",
                t = t && 0 < t.trim().length ? t : "",
                i = i && 0 < i.trim().length ? i : "",
                n = n && 0 < n.trim().length ? n : "",
                $(".profile-pic").attr({
                    "data-uuid": i,
                    "data-crop": n,
                    "data-ref": e,
                    "data-photo-name": t
                })
        }
        ,
        this.setNewImg = function(e) {
            log.info("setNewImg=" + e),
            void 0 !== e && 0 < e.trim().length && (e = -1 === e.indexOf("https") ? e.replace("http", "https") : e,
                $(".profile-pic").find("img").attr({
                    src: e
                }),
                g.setTVBackGround())
        }
        ,
        this.setUCUploadData = function(e, t, a, i) {
            e = void 0 !== e && 0 < e.trim().length ? e : "",
                t = void 0 !== t && 0 < t.trim().length ? t : "",
                a = void 0 !== a && 0 < a.trim().length ? a : "",
                i = i && 0 < i.trim().length ? i : "f",
                $(".profile-pic").attr({
                    "data-uuid": e,
                    "data-crop": t,
                    "data-photo-name": a,
                    "data-ref": "",
                    "data-smallerImage": i
                })
        }
        ,
        this.setTVBackGround = function() {
            var t = $(".profile-pic img").attr("src")
                , e = new Image;
            e.onload = function() {
                var e;
                $(".profile-pic").css("background-image", "url(" + t + ")"),
                    null !== t && -1 !== t.indexOf("/noImg/categoryIcons/") ? ($(".room-settings .profile-pic").addClass("category-image"),
                        e = $(".profile-pic").attr("bg-color"),
                        $(".profile-pic").css("background-color", e)) : $(".room-settings .profile-pic").removeClass("category-image")
            }
                ,
                e.onerror = function() {
                    var e = $("#input-hidden-catg-icon-url").val();
                    $(".profile-pic").css("background-image", "url(" + e + ")");
                    e = $(".profile-pic").attr("bg-color");
                    $(".profile-pic").css("background-color", e),
                        $(".room-settings .profile-pic").addClass("category-image")
                }
                ,
                e.src = t
        }
        ,
        this.prefillWelcomMsg = function() {
            var e = g.getWelcomeMsg()
                , t = g.getDesc();
            "" === e && "" !== t && ($("#input-txt-room-intro").val(t),
                $("#input-txt-room-intro").addClass("active"),
                $("#input-txt-room-intro").height($("textarea")[1].scrollHeight),
                g.updateCharCount("sec4", 255 - t.length))
        }
        ,
        this.validateFields = function() {
            var e = !0
                , t = g.getName()
                , a = g.getDesc()
                , i = g.getWelcomeMsg()
                , n = g.getCategory()
                , s = g.getSubCategory()
                , o = g.getLanguage()
                , d = g.getRating()
                , r = g.getUuid()
                , l = g.getCrop()
                , c = g.getPhotoRef()
                , m = ($("#input-hidden-country-filter").val(),
                $("#input-hidden-adult-filter").val());
            if (log.info("details tab validation -- START"),
                tabs.disableError(tab_detail),
                void 0 === t || 0 === t.trim().length || "Type a name here..." === t ? (e = !1,
                    g.showErrorOnSection("sec0", "Please enter room name.")) : 50 < t.length ? (e = !1,
                    g.showErrorOnSection("sec0", "Your room name should not be more than 50 characters.")) : g.metaChars(t) && (e = !1,
                    g.showErrorOnSection("sec0", "Your room name has invalid text.")),
            "" !== a && 0 < a.trim().length && ("undefined" === a || "null" === a || "Type a description here..." === a ? (e = !1,
                g.showErrorOnSection("sec3", "Please enter room description.")) : 128 < a.length ? (e = !1,
                g.showErrorOnSection("sec3", "Description must not contain Lengthy words.")) : g.metaChars(a) && (e = !1,
                g.showErrorOnSection("sec3", "Your room description has invalid characters."))),
            "" !== i && 0 < i.trim().length && ("undefined" === i || "null" === i || "Type a welcome msg here..." === i ? (e = !1,
                g.showErrorOnSection("sec4", "Please enter welcome message.")) : 255 < i.length ? (e = !1,
                g.showErrorOnSection("sec4", "Welcome message must not contain Lengthy words.")) : g.metaChars(i) && (e = !1,
                g.showErrorOnSection("sec4", "Welcome message has invalid characters."))),
            n <= 0 && (e = !1,
                g.showErrorOnSection("sec5", "Please select category.")),
            s <= 0 && (e = !1,
                g.showErrorOnSection("sec6", "Please select subcategory.")),
            o <= 0 && (e = !1,
                g.showErrorOnSection("sec7", "Please select language.")),
                void 0 === d || 0 === d.length ? (e = !1,
                    g.showErrorOnSection("sec8", "Please select rating.")) : 2250 === n && 900 === s || "true" === m ? "G" !== d && (e = !1,
                    g.showErrorOnSection("sec8", "Selected rating is not a valid. Please select another one.")) : 2900 === n && 800 === s ? ("G" === d || "A" !== d && "R" !== d) && (e = !1,
                    g.showErrorOnSection("sec8", "Selected rating is not a valid. Please select another one.")) : "G" !== d && "R" !== d && "A" !== d && (e = !1,
                    g.showErrorOnSection("sec8", "Selected rating is not a valid. Please select another one.")),
            g.clean_data.photo_name !== g.getPhotoName()) {
                if (log.info("photo change detected"),
                c <= 0 && "" === r)
                    return e = !1,
                        void g.photoError(msg_err_general);
                if ("" !== r) {
                    if (!1 === g.isUUIDValid(r))
                        return e = !1,
                            void g.photoError(msg_err_general);
                    if (!1 === g.isCropValid(l))
                        return e = !1,
                            void g.photoError(msg_err_general)
                }
            }
            return e
        }
        ,
        this.is_form_dirty = function() {
            return g.getName() !== g.clean_data.name ? (g.dirty = !0,
                log.info("is_form_dirty -- name")) : g.getDesc() !== g.clean_data.desc ? (g.dirty = !0,
                log.info("is_form_dirty -- desc")) : g.getWelcomeMsg() !== g.clean_data.welcome_msg ? (g.dirty = !0,
                log.info("is_form_dirty -- welcome_msg")) : g.getCategory() !== g.clean_data.category ? (g.dirty = !0,
                log.info("is_form_dirty -- category")) : g.getSubCategory() !== g.clean_data.subcategory ? (g.dirty = !0,
                log.info("is_form_dirty -- subcategory")) : g.getLanguage() !== g.clean_data.lang ? (g.dirty = !0,
                log.info("is_form_dirty -- lang")) : g.getRating() !== g.clean_data.rating ? (g.dirty = !0,
                log.info("is_form_dirty -- rating")) : g.getInactive() !== g.clean_data.inactive && (g.dirty = !0,
                g.dirty_inactive = !0,
                log.info("is_form_dirty -- inactive")),
                g.getPhotoName() !== g.clean_data.photo_name ? (g.dirty = !0,
                    g.img_dirty = !0,
                    log.info("is_form_dirty -- photoname")) : g.getPhotoUrl() !== g.clean_data.photo_url && (g.dirty = !0,
                    g.img_dirty = !0,
                    log.info("is_form_dirty -- photo_url")),
            0 != g.img_dirty || !1 !== g.dirty
        }
        ,
        this.reset_dirty_settings = function() {
            g.dirty = !1,
                g.img_dirty = !1,
                g.dirty_inactive = !1
        }
        ,
        this.update_view = function() {
            g.setCleanData(),
                $(".profile-pic").find("img").attr("src", g.clean_data.photo_url),
                $(".profile-pic").attr("data-photo-name", g.clean_data.photo_name),
                g.setTVBackGround(),
                $("#sec0").find("div.view-profile").find("p").text(g.clean_data.name),
                $("#sec3").find("div.view-profile").find("p").text(g.clean_data.desc),
                $("#sec4").find("div.view-profile").find("p").text(g.clean_data.welcome_msg),
                $("#sec5").find("div.view-profile").find("p").text(g.clean_data.category_name),
                $("#sec6").find("div.view-profile").find("p").text(g.clean_data.subcategory_name),
                $("#sec7").find("div.view-profile").find("p").text(g.clean_data.lang_name),
                $("#sec8").find("div.view-profile").find("p").text(g.clean_data.rating_desc)
        }
        ,
        this.save_changes = function() {
            var a, e;
            return g.reset_dirty_settings(),
                "Y" === rd.getInactiveOrg() && "Y" === rd.getInactive() ? (tabs.disableSubmitBtn(tab_detail),
                    void tabs.err_msg_tab_bottom_name(tab_detail, msg_err_inactive)) : 0 == g.validateFields() ? (tabs.disableSubmitBtn(tab_detail),
                    void tabs.err_msg_tab_bottom_name(tab_detail, msg_form_validation_err)) : !1 === g.is_form_dirty() ? (tabs.disableSubmitBtn(tab_detail),
                    void tabs.err_msg_tab_bottom_name(tab_detail, msg_err_dirty)) : (e = {
                    name: encodeURIComponent(g.getName().replace(/%/g, "{{pc}}")),
                    desc: encodeURIComponent(g.getDesc().replace(/%/g, "{{pc}}")),
                    i_msg: encodeURIComponent(g.getWelcomeMsg().replace(/%/g, "{{pc}}")),
                    catg: encodeURIComponent(g.getCategory()),
                    sub_catg: encodeURIComponent(g.getSubCategory()),
                    lang: encodeURIComponent(g.getLanguage()),
                    rating: encodeURIComponent(g.getRating()),
                    inactive: encodeURIComponent(g.getInactive()),
                    uuid: encodeURIComponent(g.getUuid()),
                    crop: encodeURIComponent(g.getCrop()),
                    photoref: encodeURIComponent(g.getPhotoRef()),
                    photoname: encodeURIComponent(g.getPhotoName()),
                    pt_sm: encodeURIComponent(g.getSmallerImage()),
                    dirty: g.dirty,
                    dirty_img: g.img_dirty,
                    pwoft: token.get(),
                    act: "save_details"
                },
                    log.info(e),
                    tabs.loader("show"),
                    tabs.set_page_timeOut(),
                    tabs.disableSubmitBtn(tab_detail),
                    void $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomSettingsAjax", e, function(e, t) {
                        "success" === t ? (tabs.clear_page_timeout(),
                            a = e,
                            log.info(a),
                            token.set(a.token),
                            a.success ? !1 === g.dirty_inactive ? (g.update_view(),
                                tabs.success_msg_tab_bottom_name(tab_detail, msg_success),
                                tabs.disableEditView(tab_detail),
                                tabs.loader("hide")) : location.reload(!0) : (tabs.disableSubmitBtn(tab_detail),
                                tabs.err_msg_tab_bottom_name(tab_detail, a.message),
                                g.handle_errors(a.errors),
                                tabs.loader("hide"))) : (tabs.disableSubmitBtn(tab_detail),
                            tabs.err_msg_tab_bottom_name(tab_detail, msg_err_request_timeout),
                            tabs.loader("hide"))
                    }))
        }
        ,
        this.handle_errors = function(e) {
            var a, i;
            !1 === $.isEmptyObject(e) && $.each(e, function(e, t) {
                a = t.title,
                    i = t.message,
                    "roomname" === a ? g.showErrorOnSection("sec0", i) : "desc" === a ? g.showErrorOnSection("sec3", i) : "welcome_msg" === a ? g.showErrorOnSection("sec4", i) : "category" === a ? g.showErrorOnSection("sec5", i) : "subcategory" === a ? g.showErrorOnSection("sec6", i) : "language" === a ? g.showErrorOnSection("sec7", i) : "rating" === a ? g.showErrorOnSection("sec8", i) : "inactive" === a ? g.showErrorOnSection("sec9", i) : "photo" === a && g.photoError(i)
            })
        }
        ,
        this.metaChars = function(e) {
            for (var t, a = ["<", ">", "alert", "script", "javascript", "document.", "cookie", "onmouseover", "onclick", "src="], i = e.toUpperCase(), n = 0; n < i.length; n++)
                if (t = "" + i.substring(n, n + 1),
                -1 !== $.inArray($.trim(t), a))
                    return log.info("metaChars, Match Found. input=" + e),
                        !0;
            return !1
        }
        ,
        this.isUUIDValid = function(e) {
            return void 0 !== e && 0 < e.trim().length && (!(e.trim().length < 10 || 64 < e.trim().length) && !1 !== /^[A-Za-z0-9-]+$/.test(e))
        }
        ,
        this.isCropValid = function(e) {
            return !(void 0 !== e && 0 < e.trim().length) || !(e.trim().length < 10 || 64 < e.trim().length) && -1 !== e.indexOf("/crop/")
        }
        ,
        this.setting_delete_photo_link = function() {
            $(".delete-pic").addClass("hide"),
            "" !== g.getPhotoName() && $(".delete-pic").removeClass("hide")
        }
        ,
        this.set_no_img_catg_icon = function(e) {
            var t = g.get_catg_no_img_base_url();
            rd.getCategory();
            ("" === g.getPhotoName() && "catg" === e || "del_pic" === e) && g.setNewImg(t)
        }
        ,
        this.clean_up_photo_attrs = function() {
            $(".profile-pic").removeAttr("data-uuid"),
                $(".profile-pic").removeAttr("data-crop"),
                $(".profile-pic").removeAttr("data-ref")
        }
        ,
        this.set_rating_data = function() {
            var e = ""
                , t = g.getCategory()
                , a = g.getSubCategory()
                , i = $("#input-hidden-country-filter").val()
                , n = $("#input-hidden-adult-filter").val();
            log.info("set_rating_data: category=" + t),
                log.info("set_rating_data: subCatgCode=" + a),
                log.info("set_rating_data: adultFilter=" + n),
                log.info("set_rating_data: countryFilter=" + i),
                e += '<option value="" data-value="">Select</option>',
                2250 === t && 900 === a || "true" === i ? e += '<option value="G" data-value="G">G - General Audience, including minors</option>' : (2900 === t && 800 === a || (e += '<option value="G" data-value="G">G - General Audience, including minors</option>'),
                    e += '<option value="R" data-value="R">R - Adult language permitted, no nudity</option>',
                    e += '<option value="A" data-value="A">A - Adult language and nudity permitted</option>'),
                $("#dd-rating").empty(),
                $("#dd-rating").append(e),
                $("#dd-rating").attr("data-value", "").trigger("change")
        }
        ,
        this.setTBState = function(e) {
            $("#input-txt-room-name").removeClass("active"),
                $("#input-txt-room-desc").removeClass("active"),
                $("#input-txt-room-intro").removeClass("active"),
            "" !== this.getName() && $("#input-txt-room-name").addClass("active"),
            "" !== this.getDesc() && $("#input-txt-room-desc").addClass("active"),
            "" !== this.getWelcomeMsg() && $("#input-txt-room-intro").addClass("active"),
                $("#input-txt-room-desc").height($("textarea")[0].scrollHeight).css("overflow", "hidden"),
                $("#input-txt-room-intro").height($("textarea")[1].scrollHeight).css("overflow", "hidden")
        }
}, _registerEventsDetailsTab = function() {
    $("#input-txt-room-name").focusin(function() {
        var e = $(this).val();
        void 0 !== e && 0 !== e.trim().length || ($(this).removeClass("active"),
            rd.updateCharCount("sec0", 50)),
            $(this).parent().addClass("active")
    }).focusout(function() {
        var e = $(this).val();
        void 0 !== e && 0 !== e.trim().length || ($(this).removeClass("active"),
            rd.updateCharCount("sec0", 50)),
            $(this).parent().removeClass("active")
    }),
        $("#input-txt-room-name").on("keypress keyup keydown paste copy cut", function(e) {
            var t, a = $(this).val();
            e.which || e.keyCode;
            $(this).addClass("active"),
                a.length <= 50 ? (t = 50 - a.length,
                    rd.hideErrorOnSection("sec0"),
                    rd.updateCharCount("sec0", t)) : ($(this).focus(),
                    rd.showErrorOnSection("sec0", "You have reached the max character limit of 50 characters.")),
                tabs.enableSubmitBtn(tab_detail)
        }),
        $("#input-txt-room-desc").focusin(function() {
            var e = $(this).val();
            null != e && 0 !== e.trim().length || ($(this).removeClass("active"),
                rd.updateCharCount("sec3", 128)),
                $(this).parent().addClass("active")
        }).focusout(function() {
            var e = $(this).val();
            null != e && 0 !== e.trim().length || ($(this).removeClass("active"),
                rd.updateCharCount("sec3", 128)),
                $(this).parent().removeClass("active")
        }),
        $("#input-txt-room-desc").on("keypress keyup keydown paste copy cut", function(e) {
            var t, a = $(this).val();
            e.which || e.keyCode;
            $(this).addClass("active"),
                $(this).height(0).height(this.scrollHeight).css("overflow", "hidden"),
                a.length <= 128 ? (t = 128 - a.length,
                    rd.hideErrorOnSection("sec3"),
                    rd.updateCharCount("sec3", t)) : ($(this).focus(),
                    rd.showErrorOnSection("sec3", "You have reached the max character limit of 128 characters.")),
                tabs.enableSubmitBtn(tab_detail)
        }),
        $("#input-txt-room-intro").focusin(function() {
            var e = $(this).val();
            void 0 !== e && 0 !== e.trim().length || ($(this).removeClass("active"),
                rd.updateCharCount("sec4", 255)),
                $(this).parent().addClass("active")
        }).focusout(function() {
            var e = $(this).val();
            void 0 !== e && 0 !== e.trim().length || ($(this).removeClass("active"),
                rd.updateCharCount("sec4", 255)),
                $(this).parent().removeClass("active")
        }),
        $("#input-txt-room-intro").on("keypress keyup keydown paste copy", function(e) {
            var t, a = $(this).val();
            e.which || e.keyCode;
            $(this).addClass("active"),
                $(this).height(0).height(this.scrollHeight).css("overflow", "hidden"),
                a.length <= 255 ? (t = 255 - a.length,
                    rd.hideErrorOnSection("sec4"),
                    rd.updateCharCount("sec4", t)) : ($(this).focus(),
                    rd.showErrorOnSection("sec4", "You have reached the max character limit of 255 characters.")),
                tabs.enableSubmitBtn(tab_detail)
        }),
        $("#edit-room-pic").click(function() {
            var t, e = $(".profile-pic").attr("data-photo-name");
            e = e && 0 < e.trim().length ? e : "",
                log.info("currentImgName=" + e),
                (t = new UC).setMaxFileSize(2621440),
                t.setToken(token.get()),
                t.setTokenParamName("pwoft"),
                t.setSelectedImgName(e),
                t.showGallery().done(function(e) {
                    log.info(e),
                        token.set(t.getToken()),
                        rd.setUCData(e.photoRef, e.photoName, e.has_crop_data, e.uuid, e.crop),
                        rd.setNewImg(e.cdnURL),
                        rd.setting_delete_photo_link(),
                        tabs.enableSubmitBtn(tab_detail)
                }).fail(function() {
                    token.set(t.getToken())
                }),
                t.upload().done(function(e) {
                    log.info(e),
                        token.set(t.getToken()),
                        rd.setUCUploadData(e.uuid, e.crop, e.name, e.smallerImage),
                        rd.setNewImg(e.cdnURL),
                        rd.setting_delete_photo_link(),
                        tabs.enableSubmitBtn(tab_detail)
                }).fail(function() {
                    token.set(t.getToken())
                })
        }),
        $("#btn-submit-dt").click(function() {
            !1 === $(this).hasClass("disabled") && rd.save_changes()
        }),
        $(".round-checkbox").click(function() {
            $(this).hasClass("off") ? $(this).addClass("on").removeClass("off") : $(this).addClass("off").removeClass("on"),
                tabs.enableSubmitBtn(tab_detail)
        }),
        $(".delete-pic").click(function() {
            tabs.confirm_modal("show", "Are you sure to delete photo?", src_delete_photo)
        })
}, RoomAccess = function() {
    var r = this;
    this.getLockWord = function() {
        var e = $("#room-lockword").val();
        return log.info("getLockWord=" + e),
            void 0 !== e && 0 < e.trim().length ? e : ""
    }
        ,
        this.getWebCamRequired = function() {
            var e = 0;
            return $("#webcam-required").is(":checked") && (e = 1),
                log.info("webCamRequired=" + e),
                parseInt(e)
        }
        ,
        this.get_red_dot_member = function() {
            var e = "N";
            return $("#rd-mem-join-setting").is(":checked") && (e = "Y"),
                log.info("get_red_dot_memb=" + e),
                e
        }
        ,
        this.get_red_dot_text = function() {
            var e = "N";
            return $("#rd-mem-txt-setting").is(":checked") && (e = "Y"),
                log.info("get_red_dot_text=" + e),
                e
        }
        ,
        this.get_red_dot_video = function() {
            var e = "N";
            return $("#rd-mem-video-setting").is(":checked") && (e = "Y"),
                log.info("get_red_dot_video=" + e),
                e
        }
        ,
        this.get_send_url_setting = function() {
            var e = "N";
            return $("#send-url-setting-owner").is(":checked") && (e = "Y"),
                log.info("get_send_url_setting=" + e),
                e
        }
        ,
        this.get_email_be_verified = function() {
            var e = "N";
            return $("#should-email-be-verified").is(":checked") && (e = "Y"),
                log.info("should-email-be-verified=" + e),
                e
        }
        ,
        this.setCleanData = function() {
            r.clean_data = {
                lockword: r.getLockWord(),
                wc_required: r.getWebCamRequired(),
                rd_member: r.get_red_dot_member(),
                rd_text: r.get_red_dot_text(),
                rd_video: r.get_red_dot_video(),
                send_url: r.get_send_url_setting(),
                email_be_verified: r.get_email_be_verified()
            }
        }
        ,
        this.resetOnCancel = function() {
            $("#room-lockword").val(r.clean_data.lockword),
                $("#webcam-required").prop("checked", !1),
            0 < r.clean_data.wc_required && $("#webcam-required").prop("checked", !0),
                $("#rd-mem-join-setting").prop("checked", !1),
            "Y" === r.clean_data.rd_member && $("#rd-mem-join-setting").prop("checked", !0),
                $("#rd-mem-txt-setting").prop("checked", !1),
            "Y" === r.clean_data.rd_text && $("#rd-mem-txt-setting").prop("checked", !0),
                $("#rd-mem-video-setting").prop("checked", !1),
            "Y" === r.clean_data.rd_video && $("#rd-mem-video-setting").prop("checked", !0),
                $("#send-url-setting-owner").prop("checked", !1),
                $("#send-url-setting-anyone").prop("checked", !1),
                ("Y" === r.clean_data.send_url ? $("#send-url-setting-owner") : $("#send-url-setting-anyone")).prop("checked", !0)
        }
        ,
        this.hideErrorOnSection = function(e) {
            void 0 !== e && "" !== e && $("#" + e).find("p.error-msg").addClass("hide"),
            "at-sec0" === e && $("#room-lockword").removeClass("error")
        }
        ,
        this.showErrorOnSection = function(e, t) {
            void 0 !== e && "" !== e && "" !== t && $("#" + e).find("p.error-msg").html(t).removeClass("hide"),
            "at-sec0" === e && $("#room-lockword").addClass("error")
        }
        ,
        this.validateFields = function() {
            var e = !0
                , t = r.getLockWord()
                , a = r.getWebCamRequired()
                , i = r.get_red_dot_member()
                , n = r.get_red_dot_text()
                , s = r.get_red_dot_video()
                , o = r.get_send_url_setting()
                , d = r.get_email_be_verified();
            return log.info("access tab validation -- START"),
                tabs.disableError(tab_access),
            t && 0 < t.trim().length && (/[^a-zA-Z0-9]/.test(t) ? (log.info("Lockword has invalid text"),
                e = !1,
                r.showErrorOnSection("at-sec0", "The only valid characters besides letters (a-z A-Z) and numbers (0-9).")) : 12 < t.trim().length && (log.info("lockword > 12"),
                e = !1,
                r.showErrorOnSection("at-sec0", "Lockword should not be more than 12 characters"))),
            0 !== a && 1 !== a && (log.info("webcam_required invalid. val=" + a),
                e = !1,
                r.showErrorOnSection("at-sec1", "Invalid setting. Members must turn on their Webcam to join my room")),
            "Y" !== i && "N" !== i && (log.info("reddot_member invalid. val=" + i),
                e = !1,
                r.showErrorOnSection("at-sec1", "Invalid Setting. Automatically red dot member upon room join")),
            "Y" !== n && "N" !== n && (log.info("reddot_text invalid. val=" + n),
                e = !1,
                r.showErrorOnSection("at-sec1", "Invalid Setting. Red dot prevents text entry")),
            "Y" !== s && "N" !== s && (log.info("reddot_video invalid. val=" + s),
                e = !1,
                r.showErrorOnSection("at-sec1", "Invalid Setting. Red dot prevents video functionality")),
            "Y" !== o && "N" !== o && (log.info("send_url invalid. val=" + o),
                e = !1,
                r.showErrorOnSection("at-sec2", "Invalid Setting")),
            "Y" !== d && "N" !== d && (log.info("email_be_verified invalid. val=" + d),
                e = !1,
                r.showErrorOnSection("at-sec1", "Invalid Setting. Email verification for room participants")),
                log.info("access tab validation -- END"),
                e
        }
        ,
        this.reset_dirty_settings = function() {
            r.dirty = !1
        }
        ,
        this.is_form_dirty = function() {
            return r.getLockWord() !== r.clean_data.lockword ? (log.info("is_form_dirty -- lockword"),
                r.dirty = !0) : r.getWebCamRequired() !== r.clean_data.wc_required ? (log.info("is_form_dirty -- webcam_required"),
                r.dirty = !0) : r.get_red_dot_member() !== r.clean_data.rd_member ? (log.info("is_form_dirty -- reddot_member join"),
                r.dirty = !0) : r.get_red_dot_text() !== r.clean_data.rd_text ? (log.info("is_form_dirty -- reddot_text"),
                r.dirty = !0) : r.get_red_dot_video() !== r.clean_data.rd_video ? (log.info("is_form_dirty -- reddot_video"),
                r.dirty = !0) : r.get_send_url_setting() !== r.clean_data.send_url ? (log.info("is_form_dirty -- send_url"),
                r.dirty = !0) : r.get_email_be_verified() !== r.clean_data.email_be_verified && (log.info("is_form_dirty -- email_be_verified"),
                r.dirty = !0),
                r.dirty
        }
        ,
        this.update_view = function() {
            r.setCleanData(),
                $("#at-sec0").find("div.view-profile").find("p").html(r.clean_data.lockword),
                $("#view_webcam_required").text(1 === r.clean_data.wc_required ? "Enabled" : "Disabled"),
                $("#view_reddot_memb").text("Y" === r.clean_data.rd_member ? "Enabled" : "Disabled"),
                $("#view_reddot_txt").text("Y" === r.clean_data.rd_text ? "Enabled" : "Disabled"),
                $("#view_reddot_video").text("Y" === r.clean_data.rd_video ? "Enabled" : "Disabled"),
                $("#view_reddot_video").text("Y" === r.clean_data.rd_video ? "Enabled" : "Disabled"),
                $("#view_email_verified").text("Y" === r.clean_data.email_be_verified ? "Enabled" : "Disabled"),
                $("#at-sec2").find("div.view-profile").find("span.value").html("Y" === r.clean_data.send_url ? "Owner/Admins" : "Anyone")
        }
        ,
        this.save_changes = function() {
            var a, e;
            return r.reset_dirty_settings(),
                0 == r.validateFields() ? (tabs.disableSubmitBtn(tab_access),
                    void tabs.err_msg_tab_bottom_name(tab_access, msg_form_validation_err)) : !1 === r.is_form_dirty() ? (tabs.disableSubmitBtn(tab_access),
                    void tabs.err_msg_tab_bottom_name(tab_access, msg_err_dirty)) : (e = {
                    lockword: r.getLockWord(),
                    wc_required: r.getWebCamRequired(),
                    rd_mem: r.get_red_dot_member(),
                    rd_txt: r.get_red_dot_text(),
                    rd_vid: r.get_red_dot_video(),
                    "should-email-be-verified": r.get_email_be_verified(),
                    allow_url: r.get_send_url_setting(),
                    dirty: r.dirty,
                    pwoft: token.get(),
                    act: "save_access"
                },
                    log.info(e),
                    tabs.loader("show"),
                    tabs.set_page_timeOut(),
                    tabs.disableSubmitBtn(tab_access),
                    void $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomSettingsAjax", e, function(e, t) {
                        "success" === t && (tabs.clear_page_timeout(),
                            a = e,
                            log.info(a),
                            token.set(a.token),
                            a.success ? (r.update_view(),
                                tabs.success_msg_tab_bottom_name(tab_access, msg_success_access),
                                tabs.disableEditView(tab_access)) : (tabs.err_msg_tab_bottom_name(tab_access, a.message),
                                r.handle_errors(a.errors)),
                            tabs.loader("hide"))
                    }))
        }
        ,
        this.handle_errors = function(e) {
            var a, i;
            !1 === $.isEmptyObject(e) && $.each(e, function(e, t) {
                a = t.title,
                    i = t.message,
                    "lockword" === a ? r.showErrorOnSection("at-sec0", i) : "wc_required" === a ? r.showErrorOnSection("at-sec1", i) : "red_dot" === a && r.showErrorOnSection("at-sec2", i)
            })
        }
}, _registerEventsAccessTab = function() {
    $("#at-sec0").find("input").on("keyup", function() {
        tabs.enableSubmitBtn(tab_access)
    }),
        $(".cb-access-tab").click(function() {
            tabs.enableSubmitBtn(tab_access)
        }),
        $("#btn-submit-act").click(function() {
            !1 === $(this).hasClass("disabled") && roomAccess.save_changes()
        })
}, RoomAdmins = function() {
    var r = "You do not currently have admins in your room"
        , l = !1
        , c = {}
        , m = this;
    this.getAdminMonitor = function() {
        var e = "N";
        return $("#admin-monitor").is(":checked") && (e = "Y"),
            log.info("getAdminMonitor=" + e),
            e
    }
        ,
        this.getManageAdmins = function() {
            var e = $("#dd-manage-admins").find("span.valueHolder").attr("data-value");
            return log.info("getManageAdmins=" + e),
                void 0 !== e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getManageAdminsAbbr = function() {
            var e = $("#dd-manage-admins").find("span.valueHolder").text();
            return log.info("getManageAdminsAbbrv=" + e),
                void 0 !== e && 0 < e.trim().length ? e : ""
        }
        ,
        this.getNickname = function() {
            var e = void 0 !== (e = $("#input-txt-nickname").val()) || 0 < e.trim().length ? e : "";
            return log.info("getNickname=" + e),
                e
        }
        ,
        this.getAdminType = function() {
            var e = void 0 !== (e = $("#dd-add-newadmin").find("span.valueHolder").attr("data-value")) || 0 < e.trim().length ? e : "";
            return log.info("getAdminType=" + e),
                e
        }
        ,
        this.setCleanData = function() {
            m.clean_data = {
                admin_monitor: m.getAdminMonitor(),
                manage_admins: m.getManageAdmins(),
                manage_admin_abbr: m.getManageAdminsAbbr()
            }
        }
        ,
        this.resetOnCancel = function() {
            $("#admin-monitor").prop("checked", !1),
            "Y" === m.clean_data.admin_monitor && $("#admin-monitor").prop("checked", !0),
                $("#dd-manage-admins").find("span.valueHolder").attr("data-value", m.clean_data.manage_admins).text(m.clean_data.manage_admin_abbr),
                $("#input-txt-nickname").val(""),
                $("#link-add-newadmin").addClass("disabled"),
                $("#dd-add-newadmin").find("span.valueHolder").attr("data-value", ""),
                $("#dd-add-newadmin").find("span.valueHolder").html("Select"),
                m.resetDeleteChkBoxes(),
                m.hideMessages()
        }
        ,
        this.hideErrorOnSection = function(e) {
            void 0 !== e && "" !== e && $("#" + e).find("p.error-msg").addClass("hide")
        }
        ,
        this.showErrorOnSection = function(e, t) {
            void 0 !== e && "" !== e && "" !== t && $("#" + e).find("p.error-msg").html(t).removeClass("hide")
        }
        ,
        this.hideSuccessOnSection = function(e) {
            void 0 !== e && "" !== e && $("#" + e).find("p.success-msg").addClass("hide")
        }
        ,
        this.showSuccessOnSection = function(e, t) {
            void 0 !== e && "" !== e && "" !== t && $("#" + e).find("p.success-msg").html(t).removeClass("hide")
        }
        ,
        this.hideMessages = function() {
            $("#add-admin-msg-area").addClass("hide"),
                $("#as-sec1").find("p.success-msg").addClass("hide"),
                $("#as-sec1").find("p.error-msg").addClass("hide"),
                $("#as-sec0").find("p.success-msg").addClass("hide"),
                $("#as-sec0").find("p.error-msg").addClass("hide")
        }
        ,
        this.update_view = function() {
            m.setCleanData(),
                $("#as-sec0").find("div.view-profile").find("p").html("Y" === m.clean_data.admin_monitor ? "Enabled" : "Disabled"),
                $("#as-sec1").find("div.view-profile").find("div.value").html(m.clean_data.manage_admin_abbr)
        }
        ,
        this.getRoomAdmins = function() {
            var e, t = $.Deferred();
            return !0 === l ? (log.info("loading admins from cache"),
                t.resolve(c)) : (e = "RequestId=MyPalTalk.MyRoomSettingsAjax&act=lst_admins&pwoft=" + token.get(),
                log.info("dataUrl=" + e),
                $.ajax({
                    method: "GET",
                    contentType: "application/json",
                    url: "/mpt/ControllerServlet",
                    data: e,
                    success: function(e) {
                        token.set(e.token),
                            e.success ? (l = !0,
                                c = e.admins || {},
                                log.info(c),
                                t.resolve(c)) : t.reject(e.message)
                    },
                    error: function(e) {
                        t.reject(msg_err_general)
                    }
                })),
                t.promise()
        }
        ,
        this.loadAdminsViewPage = function() {
            var t, a = $.Deferred(), i = "", n = 0, s = $("#input-hidden-nophoto-35").val();
            return m.getRoomAdmins().done(function(e) {
                if ($.isEmptyObject(e))
                    $(".manage-admin").find("div.view-profile").empty(),
                        $(".manage-admin").find("div.view-profile").append('<p class="no-admins">' + r + "</p>");
                else {
                    for (i += '<div class="table admin-list-table">',
                             i += '<div class="thead"><div class="tr"><div class="td">Nickname</div><div class="td">Level</div><div class="td">Date Added</div></div></div>',
                             i += '<div class="tbody notranslate">',
                             n = 0; n < e.length; n++)
                        t = e[n],
                        $.isEmptyObject(t) || (i += '<div class="tr">',
                            i += '<div class="td" data-title="Nickname">',
                            i += '<a><img class="lazy" src="' + s + '" data-src="' + t.image_url + '" alt="' + t.nick + '"/></a>',
                            i += '<a href="http://www.paltalk.com/people/users/' + t.nick + '/index.wmt" title="' + t.nick + '" target="_blank">' + t.nick + "</a>",
                            i += "</div>",
                            i += '<div class="td" data-title="Level">' + m.displayAdminType(t.admin_type) + "</div>",
                            i += '<div class="td" data-title="Date Added">' + (t.createdDt && "-1" !== t.createdDt ? t.createdDt : "") + "</div>",
                            i += "</div>");
                    i += "</div>",
                        i += "</div>",
                        $(".manage-admin").find("div.view-profile").empty(),
                        $(".manage-admin").find("div.view-profile").append(i),
                        m.lazyLoadImages()
                }
                a.resolve()
            }).fail(function(e) {
                $(".manage-admin").find("div.view-profile").empty(),
                    $(".manage-admin").find("div.view-profile").append('<p class="no-admins">' + e + "</p>"),
                    a.reject("")
            }),
                a.promise()
        }
        ,
        this.loadAdminsEditPage = function() {
            var t, a = $.Deferred(), i = "", n = 0, s = {}, o = $("#input-hidden-nophoto-35").val();
            return m.getRoomAdmins().done(function(e) {
                if ($.isEmptyObject(e))
                    $(".manage-admin").find("div.edit-profile").empty(),
                        $(".manage-admin").find("div.edit-profile").append('<p class="no-admins">' + r + "</p>");
                else {
                    for (i += '<div class="buttons text-right">',
                             i += '<a id="idBtnDelete" class="btn-submit btn-delete disabled">Delete</a>',
                             i += "</div>",
                             i += '<div class="table admin-list-table">',
                             i += '<div class="thead"><div class="tr">',
                             1 == e.length ? i += '<div class="td disabled"><div class="checkbox"><input id="idCbSelectAll" type="checkbox" value=""/><label for="idCbSelectAll"></label></div></div>' : i += '<div class="td"><div class="checkbox"><input id="idCbSelectAll" type="checkbox" value=""/><label for="idCbSelectAll"></label></div></div>',
                             i += '<div class="td">Nickname</div><div class="td">Level</div><div class="td">Date Added</div></div></div>',
                             i += '<div class="tbody notranslate">',
                             n = 0; n < e.length; n++)
                        s = e[n],
                        $.isEmptyObject(s) || (t = s.nick.replace("(", "-").replace(")", "").split(" ").join("-"),
                            i += '<div class="tr" id="' + t + '" data-type="' + s.admin_type + '" data-uid="' + s.uid + '">',
                            0 == n ? (i += '<div class="td disabled">',
                                i += '<div class="checkbox"><input type="checkbox" value="" id="idCb' + s.uid + '"/><label for="idCb' + s.uid + '"></label></div>') : (i += '<div class="td">',
                                i += '<div class="checkbox"><input type="checkbox" value="" class="classCbAdmin" id="idCb' + s.uid + '"/><label for="idCb' + s.uid + '"></label></div>'),
                            i += "</div>",
                            i += '<div class="td" data-title="Nickname">',
                            i += '<a><img class="lazy" src="' + o + '" data-src="' + s.image_url + '" alt="' + s.nick + '"/></a>',
                            i += '<a href="http://www.paltalk.com/people/users/' + s.nick + '/index.wmt" title="' + s.nick + '" target="_blank">' + s.nick + "</a>",
                            i += "</div>",
                            i += 0 == n ? '<div class="td disabled" data-title="Level">' : '<div class="td" data-title="Level">',
                            i += '<div class="form-group">',
                            i += '<div class="wrapper-dropdown" id="dd-admins-edit-' + s.uid + '" data-parent-uid="' + s.uid + '" data-parent-level="' + s.admin_type + '" data-parent-id="' + t + '" data-nick="' + s.nick + '">',
                            i += '<span class="valueHolder" data-value="' + s.admin_type + '">' + m.displayAdminType(s.admin_type) + "</span>",
                            i += '<div class="dropdown"><ul><li class="option" data-value="admin">Admin</li><li class="option" data-value="sadmin">Super Admin</li></ul></div>',
                            i += "</div>",
                            i += "</div>",
                            i += "</div>",
                            i += '<div class="td" data-title="Date Added">' + (s.createdDt && "-1" !== s.createdDt ? s.createdDt : "") + "</div>",
                            i += "</div>");
                    i += "</div></div>",
                        $(".manage-admin").find("div.edit-profile").empty(),
                        $(".manage-admin").find("div.edit-profile").append(i),
                        m.lazyLoadImages()
                }
                a.resolve({})
            }).fail(function(e) {
                $(".manage-admin").find("div.edit-profile").empty(),
                    $(".manage-admin").find("div.edit-profile").append('<p class="no-admins">' + e + "</p>"),
                    a.reject
            }),
                a.promise()
        }
        ,
        this.displayAdminType = function(e) {
            return "admin" === (e = e.toLowerCase().trim()) ? "Admin" : "sadmin" === e ? "Super Admin" : "rowner" === e ? "Room Owner" : void 0
        }
        ,
        this.lazyLoadImages = function() {
            var t = [];
            $(".lazy").each(function(e) {
                t.push($(this))
            }),
            void 0 !== t && !1 !== t.length && m.loadImagesInSequence(t)
        }
        ,
        this.loadImagesInSequence = function(e) {
            var t, a = e.shift(), i = new Image;
            void 0 !== a && 0 !== a.length && (t = a.attr("data-src"),
                log.info("imageURL= " + t),
                i.onload = function() {
                    a.attr("src", this.src),
                        m.loadImagesInSequence(e)
                }
                ,
                i.onerror = function() {
                    a.attr("src", "https://commerce.paltalk.com/mpt4images/tmp-not-avail.jpg"),
                        m.loadImagesInSequence(e)
                }
                ,
                i.src = t)
        }
        ,
        this.save_change_admin_monitor = function() {
            var a, e, i, n, t = m.getAdminMonitor();
            log.info("save admin monitor changes."),
                m.clean_data.admin_monitor !== t ? "N" === t || "Y" === t ? (e = {
                    act: "save_admins",
                    field: "admin_monitor",
                    admin_monitor: t,
                    pwoft: token.get()
                },
                    log.info(e),
                    tabs.loader("show"),
                    tabs.set_page_timeOut(),
                    $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomSettingsAjax", e, function(e, t) {
                        "success" === t && (tabs.clear_page_timeout(),
                            a = e,
                            log.info(a),
                            token.set(a.token),
                            a.success ? (m.update_view(),
                                tabs.disableEditView(tab_admins),
                                tabs.loader("hide"),
                                tabs.success_msg_tab_bottom_name(tab_admins, msg_success_access)) : (n = a.message || "",
                                0 < (i = a.errors || {}).length ? m.showErrorOnSection("as-sec0", i[0].message) : 80 < n.length ? tabs.err_msg_tab_bottom_name(tab_admins, n) : m.showErrorOnSection("as-sec0", n),
                                tabs.loader("hide")))
                    })) : c.showErrorOnSection("as-sec0", msg_err_general) : c.showErrorOnSection("as-sec0", msg_err_dirty)
        }
        ,
        this.save_change_manage_admins = function() {
            var a, e, i, n, t = m.getManageAdmins();
            log.info("save manage admins changes."),
                m.clean_data.manage_admins !== t ? "owner" === t || "sadmin" === t ? (e = {
                    act: "save_admins",
                    field: "manage_admin",
                    manage_admin: t,
                    pwoft: token.get()
                },
                    log.info(e),
                    tabs.loader("show"),
                    tabs.set_page_timeOut(),
                    $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomSettingsAjax", e, function(e, t) {
                        "success" === t && (tabs.clear_page_timeout(),
                            a = e,
                            log.info(a),
                            token.set(a.token),
                            a.success ? (m.update_view(),
                                tabs.disableEditView(tab_admins),
                                tabs.loader("hide"),
                                tabs.success_msg_tab_bottom_name(tab_admins, msg_success_access)) : (n = a.message || "",
                                0 < (i = a.errors || {}).length ? m.showErrorOnSection("as-sec1", i[0].message) : 80 < n.length ? tabs.err_msg_tab_bottom_name(tab_admins, n) : m.showErrorOnSection("as-sec1", n),
                                tabs.loader("hide")))
                    })) : m.showErrorOnSection("as-sec1", msg_err_general) : m.showErrorOnSection("as-sec1", msg_err_dirty)
        }
        ,
        this.enable_add_nick_btn = function() {
            var e = m.getNickname()
                , t = m.getAdminType();
            log.info("enable_add_nick_btn: nick=" + e + ", level=" + t),
                $("#link-add-newadmin").addClass("disabled"),
            "" != e && "" != t && $("#link-add-newadmin").removeClass("disabled")
        }
        ,
        this.toggleAddNicknameBtn = function(e) {
            "enable" === e ? $("#link-add-newadmin").removeClass("disabled") : $("#link-add-newadmin").addClass("disabled")
        }
        ,
        this.resetErrorAddAdmin = function() {
            $("#add-admin-msg-area").removeClass("error-msg").removeClass("success-msg").addClass("hide"),
                $("#input-txt-nickname").removeClass("error")
        }
        ,
        this.showErrorAddAdmin = function(e) {
            m.resetErrorAddAdmin(),
            "" !== e && 0 < e.trim().length && ($("#add-admin-msg-area").addClass("error-msg").removeClass("hide").html(e),
            "Please enter a valid Paltalk nickname" === e && $("#input-txt-nickname").addClass("error"))
        }
        ,
        this.showSuccessAddAdmin = function(e) {
            m.resetErrorAddAdmin(),
            "" !== e && 0 < e.trim().length && $("#add-admin-msg-area").addClass("success-msg").removeClass("hide").html(e)
        }
        ,
        this.validateAddAdmin = function(e, t) {
            var a = !0;
            return log.info("validateAddAdmin -- START"),
                m.resetErrorAddAdmin(),
                "" === e || 0 === e.trim().length ? (m.showErrorAddAdmin("Please enter a valid nickname"),
                    a = !1) : 30 < e.length && (m.showErrorAddAdmin("Nickname should not be more than 30 characters."),
                    a = !1),
            "admin" !== t && "sadmin" !== t && (m.showErrorAddAdmin("Admin type invalid. Please select one from dropdown"),
                a = !1),
                a
        }
        ,
        this.resetAdminView = function() {
            setTimeout(function() {
                tabs.disableEditView(tab_admins)
            }, 2e3)
        }
        ,
        this.resetDeleteChkBoxes = function() {
            $(".classCbAdmin").each(function() {
                $(this).prop("checked", !1)
            }),
                $("#idCbSelectAll").prop("checked", !1),
                $("#idBtnDelete").addClass("disabled")
        }
        ,
        this.resetAddNewAdmin = function() {
            $("#input-txt-nickname").val(""),
                $("#link-add-newadmin").addClass("disabled"),
                $("#dd-add-newadmin").find("span.valueHolder").attr("data-value", ""),
                $("#dd-add-newadmin").find("span.valueHolder").html("Select")
        }
        ,
        this.addNew = function() {
            var a, e, i, n = "", t = m.getNickname(), s = m.getAdminType();
            m.validateAddAdmin(t, s) ? (e = {
                act: "new",
                nick: m.getNickname(),
                level: m.getAdminType(),
                pwoft: token.get()
            },
                log.info(e),
                tabs.loader("show"),
                tabs.set_page_timeOut(),
                m.toggleAddNicknameBtn("disable"),
                $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomAdminsAjax", e, function(e, t) {
                    "success" === t && (tabs.clear_page_timeout(),
                        a = e,
                        log.info(a),
                        token.set(a.token),
                        a.success ? (l = !1,
                            c = {},
                            m.resetAddNewAdmin(),
                            m.resetErrorAddAdmin(),
                            m.loadAdminsEditPage().done(function() {
                                _registerEventsCommonInputField(),
                                    _registerEventsAdminsTab()
                            }),
                            m.loadAdminsViewPage().done(function() {
                                m.loadAdminsEditPage().done(function() {
                                    _registerEventsCommonInputField(),
                                        _registerEventsAdminsTab(),
                                        tabs.loader("hide"),
                                        tabs.success_msg_tab_bottom_name(tab_admins, "New admin added successfully.")
                                }).fail(function() {
                                    _registerEventsCommonInputField(),
                                        _registerEventsAdminsTab(),
                                        tabs.loader("hide"),
                                        tabs.success_msg_tab_bottom_name(tab_admins, "New admin added successfully.")
                                })
                            }).fail(function() {
                                _registerEventsCommonInputField(),
                                    _registerEventsAdminsTab(),
                                    tabs.loader("hide"),
                                    m.resetAdminView()
                            })) : (i = a.errors || {},
                            n = "" !== (n = a.message || "") && 0 < n.trim().length ? n : msg_err_general,
                            0 < i.length ? m.showErrorAddAdmin(i[0].message) : 80 < n.length ? tabs.err_msg_tab_bottom_name(tab_admins, n) : (1 == n.includes("Nick") && (n = "Nickname is already added"),
                                m.showErrorAddAdmin(n)),
                            tabs.loader("hide")))
                })) : m.toggleAddNicknameBtn("disable")
        }
        ,
        this.updateAdmin = function(e, a, t, i) {
            var n, s, o, d, r = "";
            if (log.info("updateAdmin, nick=" + e),
                log.info("updateAdmin, level=" + a),
                m.validateAddAdmin(e, a)) {
                if ((r = (r = $("#" + i).attr("data-parent-level")) && 0 < r.trim().length ? r : a) === a)
                    return log.error("no changes to submit"),
                        void tabs.err_msg_tab_bottom_name(tab_admins, msg_err_dirty);
                s = {
                    act: "edit",
                    nick: e,
                    level: a,
                    uid: t,
                    pwoft: token.get()
                },
                    log.info(s),
                    tabs.loader("show"),
                    tabs.set_page_timeOut(),
                    m.toggleAddNicknameBtn("disable"),
                    $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomAdminsAjax", s, function(e, t) {
                        "success" === t && (tabs.clear_page_timeout(),
                            n = e,
                            log.info(n),
                            token.set(n.token),
                            n.success ? (l = !1,
                                c = {},
                                $("#" + i).attr("data-parent-level", a),
                                m.loadAdminsViewPage().done(function() {
                                    tabs.loader("hide"),
                                        tabs.success_msg_tab_bottom_name(tab_admins, "Updated Successfully.")
                                }).fail(function() {
                                    tabs.loader("hide")
                                }),
                                m.loadAdminsEditPage().done(function() {
                                    _registerEventsCommonInputField(),
                                        _registerEventsAdminsTab()
                                })) : (o = n.errors || {},
                                d = n.message || "",
                                tabs.loader("hide"),
                                0 < o.length ? m.showAdminErrModal(o[0].message) : m.showAdminErrModal(d)))
                    })
            }
        }
        ,
        this.showAdminErrModal = function(e) {
            $("#error-modal").find("p.error-msg").html(e),
                $("#modal-backdrop").removeClass("hide"),
                $("#error-modal").removeClass("hide"),
            "Sorry! Bulk delete feature is temporarily suspended. Contact Paltalk Support" === e && ($("#modal-backdrop").addClass("hide"),
                tabs.err_msg_tab_bottom_name(tab_admins, "An unexpected error occurred. Please refresh the page and try again or contact Paltalk Support."))
        }
        ,
        this.deleteAdmin = function(a, e, t) {
            var i, n, s = "", o = 0;
            m.validateAddAdmin(a, e) && (n = {
                act: "del",
                nick: encodeURIComponent(a),
                level: encodeURIComponent(e),
                uid: encodeURIComponent(t),
                pwoft: token.get()
            },
                log.info(n),
                tabs.loader("show"),
                tabs.set_page_timeOut(),
                $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomAdminsAjax", n, function(e, t) {
                    "success" === t && (tabs.clear_page_timeout(),
                        i = e,
                        log.info(i),
                        token.set(i.token),
                        i.success ? ($("#" + a).remove(),
                            o = 0 < (o = $(".manage-admin .table .tbody .tr").length) ? o - 1 : o,
                            log.info("adminLen=" + o),
                        0 === o && ($(".manage-admin").find("div.edit-profile").empty(),
                            $(".manage-admin").find("div.edit-profile").append('<p class="no-admins">' + r + "</p>")),
                            l = !1,
                            c = {},
                            m.loadAdminsViewPage().done(function() {
                                tabs.disableEditView(tab_admins),
                                    tabs.loader("hide"),
                                    tabs.success_msg_tab_bottom_name(tab_admins, "Admin removed successfully.")
                            }).fail(function() {
                                tabs.loader("hide")
                            }),
                            m.loadAdminsEditPage().done(function() {
                                _registerEventsCommonInputField(),
                                    _registerEventsAdminsTab()
                            })) : (s = "" !== (s = (i.errors ? i.errors[0] : i).message) && 0 < s.trim().length ? s : msg_err_general,
                            tabs.loader("hide"),
                            m.showAdminErrModal(s)))
                }))
        }
        ,
        this.deleteAdminV2 = function() {
            var a, e, t, i = "", n = 0, s = 0, o = 0, d = "";
            $(".classCbAdmin").each(function() {
                o += 1,
                $(this).is(":checked") && (s += 1,
                    t = $(this).parent().parent().parent().attr("data-uid"),
                    1 === s && t ? d = t : t && (d = d + "," + t))
            }),
            0 !== s && "" !== d && 0 !== d.trim().length && (e = {
                act: "delV2",
                del_all: o === s ? "y" : "n",
                uid: encodeURIComponent(d),
                pwoft: token.get()
            },
                log.info(e),
                tabs.loader("show"),
                tabs.set_page_timeOut(),
                $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomAdminsAjax", e, function(e, t) {
                    "success" === t && (tabs.clear_page_timeout(),
                        a = e,
                        log.info(a),
                        token.set(a.token),
                        a.success ? (n = 0 < (n = $(".manage-admin .table .tbody .tr").length) ? n - 1 : n,
                            log.info("adminLen=" + n),
                        0 === n && ($(".manage-admin").find("div.edit-profile").empty(),
                            $(".manage-admin").find("div.edit-profile").append('<p class="no-admins">' + r + "</p>")),
                            l = !1,
                            c = {},
                            m.loadAdminsEditPage().done(function() {
                                _registerEventsCommonInputField(),
                                    _registerEventsAdminsTab()
                            }),
                            m.loadAdminsViewPage().done(function() {
                                tabs.loader("hide"),
                                    tabs.success_msg_tab_bottom_name(tab_admins, "Admins removed successfully.")
                            }).fail(function() {
                                tabs.loader("hide")
                            })) : (i = "" !== (i = (a.errors ? a.errors[0] : a).message) && 0 < i.trim().length ? i : msg_err_general,
                            tabs.loader("hide"),
                            m.showAdminErrModal(i)))
                }))
        }
}, _registerEventsAdminsTab = function() {
    $("#admin-monitor").click(function() {
        tabs.confirm_modal("show", confirm_modal_txt_admin_monitor, src_admin_monitor)
    }),
        $("#input-txt-nickname").keyup(function(e) {
            admins.enable_add_nick_btn(),
            "" !== $(this).val() && $("#input-txt-nickname").removeClass("error")
        }),
        $("#input-txt-nickname").focusin(function() {
            $(this).trigger("keypress")
        }).focusout(function() {
            $(this).trigger("keypress")
        }),
        $("#link-add-newadmin").click(function() {
            $(this).hasClass("disabled") || admins.addNew()
        }),
        $("#idCbSelectAll").on("click", function() {
            var e = 0
                , t = 0
                , a = $(this).is(":checked");
            $(".classCbAdmin").each(function() {
                t += 1,
                $(this).is(":checked") && (e += 1)
            }),
            (a && 0 < e || 0 === e) && ($(this).prop("checked", !0),
                $(".classCbAdmin").prop("checked", !0),
                $("#idBtnDelete").removeClass("disabled")),
            (!a && 0 < e || e === t) && ($(this).prop("checked", !1),
                $("#idBtnDelete").addClass("disabled"),
                $(".classCbAdmin").prop("checked", !1))
        }),
        $(".classCbAdmin").on("click", function() {
            var e = 0
                , t = 0;
            $(".classCbAdmin").each(function() {
                t += 1,
                $(this).is(":checked") && (e += 1)
            }),
                0 === e ? ($("#idCbSelectAll").prop("checked", !1),
                    $("#idBtnDelete").addClass("disabled")) : $("#idBtnDelete").removeClass("disabled"),
                t == e ? ($("#idCbSelectAll").prop("checked", !0),
                    $("#idBtnDelete").removeClass("disabled")) : $("#idCbSelectAll").prop("checked", !1)
        }),
        $("#idBtnDelete").on("click", function() {
            $("#add-admin-msg-area").addClass("hide");
            var e = 0
                , t = 0
                , a = "Delete admin?";
            $(".classCbAdmin").each(function() {
                t += 1,
                $(this).is(":checked") && (e += 1)
            }),
                0 != e ? (a = e === t ? "Are you sure you want to remove all admins from your room?" : "Are you sure you want to remove " + e + (1 < e ? " admins" : " admin") + " from your admins list?",
                    tabs.confirm_modal("show", a, src_delete_admin_v2)) : $(this).addClass("disabled")
        })
}, PremiumSettings = function() {
    var s = this;
    this.getAudioSetting = function() {
        var e = "audio-setting-default";
        return $(".audio-setting").each(function() {
            $(this).is(":checked") && (e = $(this).attr("data-val"))
        }),
            log.info("audio_setting=" + e),
            e
    }
        ,
        this.getAudioSettingId = function() {
            var e = "audio-setting-default";
            return $(".audio-setting").each(function() {
                $(this).is(":checked") && (e = $(this).attr("id"))
            }),
                log.info("audio_setting_id=" + e),
                e
        }
        ,
        this.getAudioSettingDef = function(e) {
            return "audio-setting-hifi" === e ? "Hi Fidelity" : "audio-setting-simultaneous" === e ? "Allow up to 3 members to be on the mic simultaneously" : "Default Audio (Free)"
        }
        ,
        this.getShowAlways = function() {
            var e = "N";
            return $("#show-always").is(":checked") && (e = "Y"),
                log.info("show_always=" + e),
                e
        }
        ,
        this.getPaidOnly = function() {
            var e = "N";
            return $("#paid-only").is(":checked") && (e = "Y"),
                log.info("paid_only=" + e),
                e
        }
        ,
        this.getBannerUrl = function() {
            var e = void 0 !== (e = $("#ps-banner-txt").val()) && 0 < e.trim().length ? e : "";
            return log.info("getBannerUrl=" + e),
                e
        }
        ,
        this.setCleanData = function() {
            s.clean_data = {
                audio_setting_id: s.getAudioSettingId(),
                audio_setting: s.getAudioSetting(),
                show_always: s.getShowAlways(),
                paid_only: s.getPaidOnly(),
                banner_url: s.getBannerUrl()
            }
        }
        ,
        this.resetOnCancel = function() {
            $(".audio-setting").each(function() {
                $(this).prop("checked", !1)
            }),
                $("#" + s.clean_data.audio_setting_id).prop("checked", !0),
                $("#show-always").prop("checked", !1),
            "Y" === s.clean_data.show_always && $("#show-always").prop("checked", !0),
                $("#paid-only").prop("checked", !1),
            "Y" === s.clean_data.paid_only && $("#paid-only").prop("checked", !0),
                "" !== s.clean_data.banner_url ? $("#ps-banner-txt").val(s.clean_data.banner_url) : $("#ps-banner-txt").val("")
        }
        ,
        this.hideAllErrors = function() {
            $(".error-msg").addClass("hide"),
                tabs.reset_msg_tab_bottom_name(tab_settings)
        }
        ,
        this.hideErrorOnSection = function(e) {
            void 0 !== e && "" !== e && $("#" + e).find("p.error-msg").addClass("hide")
        }
        ,
        this.showErrorOnSection = function(e, t) {
            void 0 !== e && "" !== e && "" !== t && $("#" + e).find("p.error-msg").html(t).removeClass("hide")
        }
        ,
        this.validateFields = function() {
            var e = !0
                , t = s.getAudioSetting()
                , a = s.getShowAlways()
                , i = s.getPaidOnly()
                , n = s.getBannerUrl();
            return log.info("premium settings tab validation -- START"),
                tabs.disableError(tab_settings),
            "hifidelity" !== t && "simultaneous" !== t && "default" !== t && (e = !1,
                s.showErrorOnSection("ps-sec0", "An invalid audio setting was selected, please select right one from the choices.")),
            "Y" !== a && "N" !== a && (e = !1,
                s.showErrorOnSection("ps-sec1", "An invalid show my chat room setting, pleas select right one from the form.")),
            "Y" !== i && "N" !== i && (e = !1,
                s.showErrorOnSection("ps-sec1", "An invalid Only allow members with subscribed nick setting, pleas select right one from the form.")),
            !1 === s.validateBannerUrl(n) && (e = !1),
                e
        }
        ,
        this.validateBannerUrl = function(e) {
            if ("" !== e) {
                if (e.length < 10 || 100 < e.length)
                    return s.showErrorOnSection("ps-sec2", "Banner url should be minimum 10 and maximum 100 characters length."),
                        $("#ps-banner-txt").addClass("error"),
                        !1;
                if (-1 === e.indexOf("http://") && -1 === e.indexOf("https://"))
                    return s.showErrorOnSection("ps-sec2", "Banner url has an invalid protocol. Valid ones are http & https"),
                        $("#ps-banner-txt").addClass("error"),
                        !1
            }
            return !0
        }
        ,
        this.reset_dirty_settings = function() {
            s.dirty = !1
        }
        ,
        this.is_form_dirty = function() {
            return s.getAudioSetting() !== s.clean_data.audio_setting ? (s.dirty = !0,
                log.info("is_form_dirty -- audio_setting")) : s.getShowAlways() !== s.clean_data.show_always ? (s.dirty = !0,
                log.info("is_form_dirty -- show_always")) : s.getPaidOnly() !== s.clean_data.paid_only ? (s.dirty = !0,
                log.info("is_form_dirty -- paid_only")) : s.getBannerUrl() !== s.clean_data.banner_url && (s.dirty = !0,
                log.info("is_form_dirty -- banner_url")),
                s.dirty
        }
        ,
        this.update_view = function() {
            s.setCleanData(),
                $("#ps-sec0").find("div.view-profile").find("p").html(s.getAudioSettingDef(s.clean_data.audio_setting_id)),
                $("#view-show-always").html("Disabled"),
            "Y" === s.clean_data.show_always && $("#view-show-always").html("Enabled"),
                $("#view-paid-only").html("Disabled"),
            "Y" === s.clean_data.paid_only && $("#view-paid-only").html("Enabled");
            var e = s.clean_data.banner_url;
            "" !== e ? $(".banner-ad-url").html('<a target="_blank" href="' + e + '">' + e + "</a>") : $(".banner-ad-url").html("http://")
        }
        ,
        this.save_changes = function() {
            var a, e;
            return s.reset_dirty_settings(),
                0 == s.validateFields() ? (tabs.disableSubmitBtn(tab_settings),
                    void tabs.err_msg_tab_bottom_name(tab_settings, msg_form_validation_err)) : !1 === s.is_form_dirty() ? (tabs.disableSubmitBtn(tab_settings),
                    void tabs.err_msg_tab_bottom_name(tab_settings, msg_err_dirty)) : (e = {
                    premium_settings: s.getAudioSetting(),
                    show_always: s.getShowAlways(),
                    paid_only: s.getPaidOnly(),
                    banner_url: s.getBannerUrl(),
                    dirty: s.dirty,
                    pwoft: token.get(),
                    act: "save_psettings"
                },
                    log.info(e),
                    tabs.loader("show"),
                    tabs.set_page_timeOut(),
                    tabs.disableSubmitBtn(tab_settings),
                    void $.post("/mpt/ControllerServlet?RequestId=MyPalTalk.MyRoomSettingsAjax", e, function(e, t) {
                        "success" === t && (tabs.clear_page_timeout(),
                            a = e,
                            log.info(a),
                            token.set(a.token),
                            a.success ? (s.update_view(),
                                tabs.success_msg_tab_bottom_name(tab_settings, msg_success_premium),
                                tabs.disableEditView(tab_settings)) : (tabs.err_msg_tab_bottom_name(tab_settings, a.message),
                                s.handle_errors(a.errors)),
                            tabs.loader("hide"))
                    }))
        }
        ,
        this.handle_errors = function(e) {
            var a, i;
            !1 === $.isEmptyObject(e) && $.each(e, function(e, t) {
                a = t.title,
                    i = t.message,
                    log.info("title=" + a),
                    log.info("message=" + i),
                    "audio_setting" === a ? s.showErrorOnSection("ps-sec0", i) : "show_always" === a || "paid_always" === a ? s.showErrorOnSection("ps-sec1", i) : "banner_url" === a && s.showErrorOnSection("ps-sec2", i)
            })
        }
}, _registerEventsPremiumSettingsTab = function() {
    $(".audio-setting").click(function() {
        tabs.enableSubmitBtn(tab_settings)
    }),
        $("#show-always").click(function() {
            tabs.enableSubmitBtn(tab_settings)
        }),
        $("#paid-only").click(function() {
            tabs.enableSubmitBtn(tab_settings)
        }),
        $("#ps-banner-txt").focusin(function() {
            "" !== $(this).val() && tabs.enableSubmitBtn(tab_settings)
        }).focusout(function() {
            tabs.enableSubmitBtn(tab_settings)
        }),
        $("#ps-banner-txt").bind({
            paste: function() {
                setTimeout(function() {
                    $("#ps-banner-txt").trigger("keypress")
                }, 2)
            }
        }),
        $("#ps-banner-txt").focusin(function() {
            $(this).val().length < 1 && ($(this).val("http://"),
                $(this).focus())
        }),
        $("#ps-banner-txt").keypress(function() {
            var e = (e = $(this).val()) && 0 < e.trim().length ? e : "";
            if (tabs.disableSubmitBtn(tab_settings),
                $("#ps-sec2").find("p.error-msg").addClass("hide"),
                $(this).removeClass("error"),
            8 < e.length)
                if (100 < e.length)
                    premiumSettings.showErrorOnSection("ps-sec2", "Length should not be more than 100 characters."),
                        $(this).addClass("error");
                else {
                    if (-1 === e.indexOf("http://") && -1 === e.indexOf("https://"))
                        return premiumSettings.showErrorOnSection("ps-sec2", "Invalid protocol, valid ones are http & https"),
                            $(this).addClass("error"),
                            !1;
                    tabs.enableSubmitBtn(tab_settings)
                }
        }),
        $("#btn-submit-pst").click(function() {
            !0 !== $(this).hasClass("disabled") && premiumSettings.save_changes()
        })
}, Token = function() {
    this.get = function() {
        var e = $("#web-form-token").val();
        return log.info("token--get()=" + e),
            e && 0 < e.trim().length ? e : ""
    }
        ,
        this.set = function(e) {
            log.info("token--set()=" + e),
            e && 0 < e.trim().length && $("#web-form-token").val(e)
        }
}, Tabs = function() {
    var t = ""
        , a = this;
    this.resetActive = function() {
        $(".menu").removeClass("active"),
            $(".right-col").find("section").addClass("hide")
    }
        ,
        this.showTab = function(e) {
            var t = "#section0"
                , a = "#menu0";
            tabs.setCurrentTab(tab_detail),
                e === tab_access ? (t = "#section1",
                    a = "#menu1",
                    tabs.setCurrentTab(tab_access)) : e === tab_admins ? (t = "#section2",
                    a = "#menu2",
                    tabs.setCurrentTab(tab_admins)) : e === tab_settings && (t = "#section3",
                    a = "#menu3",
                    tabs.setCurrentTab(tab_settings)),
                $(t).removeClass("hide"),
                $(a).addClass("active")
        }
        ,
        this.enableEditView = function(e) {
            e === tab_detail && ($("#section0").find(".section").find(".edit-profile").removeClass("hide"),
                $("#section0").find("#btn-details").removeClass("hide"),
                $("#section0").find(".section").find(".view-profile").addClass("hide"),
                $("#section0").find("#edit-btn-details").addClass("hide"),
                $("#section0").find(".textarea").removeClass("error"),
                $("#section0").find(".wrapper-dropdown").removeClass("error"),
                $("#sec9").removeClass("hide"),
                a.reset_msg_tab_bottom_name(tab_detail),
                a.disableSubmitBtn(tab_detail),
                rd.setting_delete_photo_link(),
                rd.prefillWelcomMsg(),
                rd.setTBState(),
            "Y" === rd.getInactive() && tabs.err_msg_tab_bottom_name(tab_detail, msg_err_inactive)),
            e == tab_access && ($("#section1").find(".section").find(".edit-profile").removeClass("hide"),
                $("#section1").find("#btn-access").removeClass("hide"),
                $("#section1").find(".section").find(".view-profile").addClass("hide"),
                $("#section1").find("#edit-btn-access").addClass("hide"),
                a.disableError(tab_access),
                a.reset_msg_tab_bottom_name(tab_access),
                a.disableSubmitBtn(tab_access)),
            e == tab_admins && ($("#section2").find(".section").find(".edit-profile").removeClass("hide"),
                $("#section2").find("#btn-admins").removeClass("hide"),
                $("#section2").find(".section").find(".view-profile").addClass("hide"),
                $("#section2").find("#edit-btn-admins").addClass("hide"),
                $("#section2").find(".addadmin").removeClass("hide"),
                a.reset_msg_tab_bottom_name(tab_admins),
                a.disableError(tab_admins),
                admins.hideMessages(),
                admins.resetOnCancel()),
            e == tab_settings && ($("#section3").find(".section").find(".view-profile").addClass("hide"),
                $("#section3").find("#edit-btn-settings").addClass("hide"),
                $("#section3").find(".section").find(".edit-profile").removeClass("hide"),
                $("#section3").find("#btn-settings").removeClass("hide"),
                a.disableError(tab_settings),
                a.reset_msg_tab_bottom_name(tab_settings),
                a.disableSubmitBtn(tab_settings)),
                $(".label-valign").addClass("valign")
        }
        ,
        this.disableEditView = function(e) {
            e === tab_detail && ($("#section0").find(".section").find(".edit-profile").addClass("hide"),
                $("#section0").find("#sec10").find(".delete-pic").addClass("hide"),
                $("#section0").find("#btn-details").addClass("hide"),
                $("#section0").find(".section").find(".view-profile").removeClass("hide"),
                $("#section0").find("#edit-btn-details").removeClass("hide"),
                $("#section0").find("p.error-msg").addClass("hide"),
                $("#section0").find("p.success-msg").addClass("hide"),
                $("#sec9").addClass("hide")),
            e == tab_access && ($("#section1").find(".section").find(".edit-profile").addClass("hide"),
                $("#section1").find("#btn-access").addClass("hide"),
                $("#section1").find(".section").find(".view-profile").removeClass("hide"),
                $("#section1").find("#edit-btn-access").removeClass("hide"),
                $("#section1").find("p.error-msg").addClass("hide"),
                $("#section1").find("p.success-msg").addClass("hide")),
            e == tab_admins && ($("#section2").find(".section").find(".edit-profile").addClass("hide"),
                $("#section2").find("#btn-admins").addClass("hide"),
                $("#section2").find(".section").find(".view-profile").removeClass("hide"),
                $("#section2").find("#edit-btn-admins").removeClass("hide"),
                $("#section2").find(".addadmin").addClass("hide"),
                $("#section2").find("p.error-msg").addClass("hide")),
            e == tab_settings && ($("#section3").find(".section").find(".view-profile").removeClass("hide"),
                $("#section3").find("#edit-btn-settings").removeClass("hide"),
                $("#section3").find(".section").find(".edit-profile").addClass("hide"),
                $("#section3").find("#btn-settings").addClass("hide"),
                $("#section3").find("p.error-msg").addClass("hide"),
                $("#section3").find("p.success-msg").addClass("hide")),
                $(".label-valign").removeClass("valign")
        }
        ,
        this.enableSubmitBtn = function(e) {
            e === tab_detail && ("N" !== rd.getInactiveOrg() && "N" !== rd.getInactive() || $("#btn-submit-dt").removeClass("disabled")),
            e === tab_access && $("#btn-submit-act").removeClass("disabled"),
            e === tab_settings && $("#btn-submit-pst").removeClass("disabled")
        }
        ,
        this.disableSubmitBtn = function(e) {
            e === tab_detail && $("#btn-submit-dt").addClass("disabled"),
            e === tab_access && $("#btn-submit-act").addClass("disabled"),
            e === tab_settings && $("#btn-submit-pst").addClass("disabled")
        }
        ,
        this.setCurrentTab = function(e) {
            "" !== e && (t = e)
        }
        ,
        this.getCurrentTabName = function() {
            return log.info("currentTab=" + t),
                t
        }
        ,
        this.disableError = function(e) {
            e === tab_detail && ($("#section0").find("p.error-msg").addClass("hide"),
                $("#section0").find(".textarea").removeClass("error"),
                $("#section0").find(".wrapper-dropdown").removeClass("error")),
            e === tab_access && ($("#section1").find("p.error-msg").addClass("hide"),
                $("#room-lockword").removeClass("error")),
            e == tab_admins && $("#section2").find("p.error-msg").addClass("hide"),
            e === tab_settings && ($("#section3").find("p.error-msg").addClass("hide"),
                $("#ps-banner-txt").removeClass("error")),
                a.reset_msg_tab_bottom_name(e)
        }
        ,
        this.err_msg_tab_bottom_name = function(e, t) {
            e === tab_detail ? a.err_msg_tab_bottom("section0", t) : e === tab_access ? a.err_msg_tab_bottom("section1", t) : e === tab_admins ? a.err_msg_tab_bottom("section2", t) : e === tab_settings && a.err_msg_tab_bottom("section3", t)
        }
        ,
        this.success_msg_tab_bottom_name = function(e, t) {
            e === tab_detail ? a.success_msg_tab_bottom("section0", t) : e === tab_access ? a.success_msg_tab_bottom("section1", t) : e === tab_admins ? a.success_msg_tab_bottom("section2", t) : e === tab_settings && a.success_msg_tab_bottom("section3", t)
        }
        ,
        this.reset_msg_tab_bottom_name = function(e) {
            e === tab_detail ? a.reset_msg_tab_bottom("section0") : e === tab_access ? a.reset_msg_tab_bottom("section1") : e === tab_admins ? a.reset_msg_tab_bottom("section2") : e === tab_settings && a.reset_msg_tab_bottom("section3")
        }
        ,
        this.reset_msg_tab_bottom = function(e) {
            $("#" + e).find("div.button").find("p").addClass("hide"),
                $("#sucs-msg").addClass("hide")
        }
        ,
        this.err_msg_tab_bottom = function(e, t) {
            "" !== e && "" !== t && (0 < $("#" + e).find("div.button").find("p").length ? $("#" + e).find("div.button").find("p").html(t).removeClass("success-msg").addClass("error-msg").removeClass("hide") : $("#" + e).find("div.button").prepend('<p class="error-msg">' + t + "</p>"))
        }
        ,
        this.success_msg_tab_bottom = function(e, t) {
            "" !== e && "" !== t && ($("#sucs-msg").html(t),
                $("#sucs-msg").removeClass("hide"),
                $("html, body").animate({
                    scrollTop: 0
                }, "slow"),
                setTimeout(function() {
                    $("#sucs-msg").addClass("hide")
                }, 4e3))
        }
        ,
        this.loader = function(e) {
            "show" === e ? ($("#modal-backdrop").removeClass("hide"),
                $(".modal").removeClass("hide"),
                $("#error-modal").addClass("hide"),
                $(".confirm-container").addClass("hide"),
                $(".inprogress-container").removeClass("hide")) : ($("#modal-backdrop").addClass("hide"),
                $(".modal").addClass("hide"),
                $(".confirm-container").addClass("hide"),
                $(".inprogress-container").addClass("hide"))
        }
        ,
        this.confirm_modal = function(e, t, a) {
            var i = "Ok"
                , n = "Cancel";
            void 0 !== t && 0 < t.trim().length && $(".confirm-container").find("p").html(t),
                void 0 !== a && 0 < a.trim().length ? ($("#btn-confirm-ok").attr("data-src", a),
                    a === src_admin_monitor || a === src_manage_admins ? i = "Save Changes" : a === src_edit_admin && (i = "Yes",
                        n = "No")) : $("#btn-confirm-ok").removeAttr("data-src"),
                $("#btn-confirm-ok").html(i),
                $("#btn-confirm-cancel").html(n),
                "show" === e ? ($("#modal-backdrop").removeClass("hide"),
                    $(".modal").removeClass("hide"),
                    $("#error-modal").addClass("hide"),
                    $(".inprogress-container").addClass("hide"),
                    $(".confirm-container").removeClass("hide")) : ($("#modal-backdrop").addClass("hide"),
                    $(".modal").addClass("hide"),
                    $(".inprogress-container").removeClass("hide"),
                    $(".confirm-container").addClass("hide"))
        }
        ,
        this.set_page_timeOut = function() {
            timeout = setTimeout(function() {
                a.loader("hide"),
                    a.err_msg_tab_bottom_name(a.getCurrentTabName(), msg_err_request_timeout)
            }, 3e4)
        }
        ,
        this.clear_page_timeout = function() {
            clearTimeout(timeout)
        }
        ,
        this.reset_confirm_modal_attr = function() {
            $("#btn-confirm-cancel").removeAttr("data-parent-id"),
                $("#btn-confirm-cancel").removeAttr("data-parent-level"),
                $("#btn-confirm-ok").removeAttr("data-nick"),
                $("#btn-confirm-ok").removeAttr("data-level")
        }
        ,
        this.get_query_parameter_by_name = function(e) {
            var t = window.location.href;
            e = e.replace(/[\[\]]/g, "\\$&");
            t = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
            return t ? t[2] ? decodeURIComponent(t[2].replace(/\+/g, " ")) : "" : null
        }
        ,
        this.initTooltip = function() {
            $(".tooltip").tooltipster({
                animation: "fade",
                delay: 300,
                theme: "default",
                trigger: "click",
                interactive: !0,
                contentCloning: !0,
                repositionOnScroll: !0
            })
        }
}, _registerEventsCommon = function() {
    $(".menu").click(function() {
        $(this).attr("id");
        var e = $(this).attr("data-section");
        tabs.resetActive(),
            tabs.disableEditView(tab_detail),
            tabs.disableEditView(tab_access),
            tabs.disableEditView(tab_admins),
            tabs.disableEditView(tab_settings),
            "section0" === e ? tabs.showTab(tab_detail) : "section1" === e ? tabs.showTab(tab_access) : "section2" === e ? tabs.showTab(tab_admins) : "section3" === e && tabs.showTab(tab_settings)
    }),
        $(".btn-edit").click(function() {
            var e = $(this).parent().parent().attr("id");
            log.info("section=" + e),
                "section0" === e ? tabs.enableEditView(tab_detail) : "section1" === e ? tabs.enableEditView(tab_access) : "section2" === e ? tabs.enableEditView(tab_admins) : "section3" === e && tabs.enableEditView(tab_settings)
        }),
        $(".btn-cancel").click(function() {
            var e, t, a = $(this).parent().parent().parent().attr("id");
            log.info(".btn-cancel, section=" + a),
                "section0" === a ? (tabs.disableEditView(tab_detail),
                    rd.resetOnCancel()) : "section1" === a ? (tabs.disableEditView(tab_access),
                    roomAccess.resetOnCancel()) : "section2" === a ? (tabs.disableEditView(tab_admins),
                    admins.resetOnCancel()) : "section3" === a ? (premiumSettings.resetOnCancel(),
                    tabs.disableEditView(tab_settings)) : (tabs.confirm_modal("hide", "", ""),
                tabs.getCurrentTabName() === tab_admins && (admins.resetOnCancel(),
                    e = $(this).attr("data-parent-id"),
                    t = $(this).attr("data-parent-level"),
                    log.info("btn-cancel, id=" + e),
                    log.info("btn-cancel, level=" + t),
                e && "" !== e && t && "" !== t && $("#" + e).find("span.valueHolder").attr("data-value", t).html(admins.displayAdminType(t)),
                    tabs.reset_confirm_modal_attr()))
        }),
        $("#btn-confirm-ok").click(function() {
            var e, t = $(this).attr("data-src"), a = "", i = "", n = 0;
            console.log(t),
                t === src_delete_photo ? (tabs.confirm_modal("hide"),
                    $(".profile-pic").removeAttr("data-photo-name"),
                    rd.set_no_img_catg_icon("del_pic"),
                    rd.setting_delete_photo_link(),
                    tabs.enableSubmitBtn(tab_detail)) : t === src_delete_admin ? (tabs.confirm_modal("hide"),
                    a = $(this).attr("data-nick"),
                    i = $(this).attr("data-level"),
                    n = $(this).attr("data-uid"),
                "" !== a && "" !== i && admins.deleteAdmin(a, i, n),
                    tabs.reset_confirm_modal_attr()) : t === src_edit_admin ? (tabs.confirm_modal("hide"),
                    a = $(this).attr("data-nick"),
                    i = $(this).attr("data-level"),
                    e = $(this).attr("data-parent-id"),
                    n = $(this).attr("data-uid"),
                "" !== a && "" !== i && admins.updateAdmin(a, i, n, e),
                    tabs.reset_confirm_modal_attr()) : t == src_admin_monitor ? (tabs.confirm_modal("hide"),
                    admins.save_change_admin_monitor()) : t == src_manage_admins ? (tabs.confirm_modal("hide"),
                    admins.save_change_manage_admins()) : t === src_delete_admin_v2 && (tabs.confirm_modal("hide"),
                    tabs.reset_confirm_modal_attr(),
                    admins.deleteAdminV2())
        }),
        $(".icon-closepopup").click(function() {
            tabs.confirm_modal("hide", "", "")
        })
}, _registerEventsCommonInputField = function() {
    $(".wrapper-dropdown").on("click", function(e) {
        var t = $(this).attr("id")
            , a = $(this).find(".dropdown")
            , i = $(e.target);
        $(".dropdown").css("display", ""),
        !i.hasClass("valueHolder") && "wrapper-dropdown" !== i.attr("class") || a.css({
            display: "block"
        }),
        i.hasClass("option") && ($(this).find("span.valueHolder").text(i.text()).attr("data-value", i.attr("data-value")),
            a.css({
                display: ""
            }),
            tabs.enableSubmitBtn(tabs.getCurrentTabName()),
            log.info("id=" + t),
            "dd-manage-admins" === t ? admins.clean_data.manage_admins !== admins.getManageAdmins() && tabs.confirm_modal("show", confirm_modal_txt_manage_admins, src_manage_admins) : "dd-add-newadmin" === t ? (admins.toggleAddNicknameBtn("disable"),
            "" !== i.attr("data-value") && 0 < i.attr("data-value").trim().length && admins.enable_add_nick_btn()) : -1 !== t.indexOf("dd-admins-edit") && (e = $(this).attr("data-parent-level"),
                a = i.attr("data-value"),
                log.info("parentLevel=" + e),
                log.info("value=" + a),
                $("#btn-confirm-ok").attr({
                    "data-parent-id": t,
                    "data-nick": $(this).attr("data-nick"),
                    "data-level": i.attr("data-value"),
                    "data-uid": $(this).attr("data-parent-uid")
                }),
                $("#btn-confirm-cancel").attr({
                    "data-parent-id": t,
                    "data-parent-level": e
                }),
            e !== a && tabs.confirm_modal("show", "Update admin level?", src_edit_admin)))
    }),
        $("select").on("click", function(e) {
            var t, a = $(this).attr("id");
            $(e.target);
            tabs.enableSubmitBtn(tabs.getCurrentTabName()),
                log.info("id=" + a),
                "dd-catg" === a ? 0 < (t = e.target.value) ? (rd.resetSubCategorySB(),
                    rd.getSubCategories(t),
                    rd.set_no_img_catg_icon("catg"),
                    $("#dd-subcatg").prop("disabled", !1)) : ($("#dd-subcatg").prop("disabled", !0),
                    rd.resetSubCategorySB()) : "dd-subcatg" === a && rd.set_rating_data()
        });
    var e = "";
    $(".dropdown").mouseenter(function() {
        clearTimeout(e)
    }),
        $(".dropdown").mouseleave(function() {
            e = setTimeout(function() {
                $(".dropdown").css("display", "")
            }, 3e3)
        })
}, Log = function() {
    this.info = function(e) {
        0
    }
        ,
        this.error = function(e) {
            0
        }
};
!function() {
    var e;
    tabs = new Tabs,
        log = new Log,
        token = new Token,
        (rd = new RoomDetails).setTVBackGround(),
        rd.setCleanData(),
        tabs.setCurrentTab(tab_detail),
        tabs.initTooltip(),
        _registerEventsCommon(),
        _registerEventsDetailsTab(),
        "N" === rd.getInactive() ? (roomAccess = new RoomAccess,
            admins = new RoomAdmins,
            premiumSettings = new PremiumSettings,
            roomAccess.setCleanData(),
            _registerEventsAccessTab(),
            premiumSettings.setCleanData(),
            _registerEventsPremiumSettingsTab(),
            admins.setCleanData(),
            admins.loadAdminsViewPage().done(function() {
                admins.loadAdminsEditPage().done(function() {
                    _registerEventsCommonInputField(),
                        _registerEventsAdminsTab(),
                        admins.lazyLoadImages()
                }).fail(function() {
                    _registerEventsCommonInputField(),
                        _registerEventsAdminsTab()
                })
            }).fail(function() {
                _registerEventsCommonInputField(),
                    _registerEventsAdminsTab()
            }),
        (e = tabs.get_query_parameter_by_name("tab")) && 0 < e.trim().length && (tabs.resetActive(),
            tabs.showTab(e))) : _registerEventsCommonInputField(),
        $("select").each(function() {
            $(this).select2()
        })
}();
