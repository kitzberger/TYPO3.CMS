/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","jquery","nprogress","TYPO3/CMS/Backend/ActionButton/DeferredAction","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Notification","TYPO3/CMS/Backend/Severity","TYPO3/CMS/Core/Event/RegularEvent","TYPO3/CMS/Backend/Input/Clearable","TYPO3/CMS/Backend/Element/IconElement"],(function(e,t,a,s,n,l,i,o,r){"use strict";var d;a=__importDefault(a),s=__importDefault(s),r=__importDefault(r),function(e){e.searchForm="#recycler-form",e.searchText="#recycler-form [name=search-text]",e.searchSubmitBtn="#recycler-form button[type=submit]",e.depthSelector="#recycler-form [name=depth]",e.tableSelector="#recycler-form [name=pages]",e.recyclerTable="#itemsInRecycler",e.paginator="#recycler-index nav",e.reloadAction="a[data-action=reload]",e.undo="a[data-action=undo]",e.delete="a[data-action=delete]",e.massUndo="button[data-multi-record-selection-action=massundo]",e.massDelete="button[data-multi-record-selection-action=massdelete]"}(d||(d={}));class c{constructor(){this.elements={},this.paging={currentPage:1,totalPages:1,totalItems:0,itemsPerPage:TYPO3.settings.Recycler.pagingSize},this.markedRecordsForMassAction=[],this.handleCheckboxStateChanged=e=>{const t=a.default(e.target),s=t.parents("tr"),n=s.data("table")+":"+s.data("uid");if(t.prop("checked"))this.markedRecordsForMassAction.push(n);else{const e=this.markedRecordsForMassAction.indexOf(n);e>-1&&this.markedRecordsForMassAction.splice(e,1)}this.markedRecordsForMassAction.length>0?(this.elements.$massUndo.find("span.text").text(this.createMessage(TYPO3.lang["button.undoselected"],[this.markedRecordsForMassAction.length])),this.elements.$massDelete.find("span.text").text(this.createMessage(TYPO3.lang["button.deleteselected"],[this.markedRecordsForMassAction.length]))):this.resetMassActionButtons()},this.deleteRecord=e=>{if(TYPO3.settings.Recycler.deleteDisable)return;const t=a.default(e.target).parents("tr"),s="TBODY"!==t.parent().prop("tagName");let i,r;if(s)i=this.markedRecordsForMassAction,r=TYPO3.lang["modal.massdelete.text"];else{const e=t.data("uid"),a=t.data("table"),s=t.data("recordtitle");i=[a+":"+e],r="pages"===a?TYPO3.lang["modal.deletepage.text"]:TYPO3.lang["modal.deletecontent.text"],r=this.createMessage(r,[s,"["+i[0]+"]"])}l.confirm(TYPO3.lang["modal.delete.header"],r,o.error,[{text:TYPO3.lang["button.cancel"],btnClass:"btn-default",trigger:function(){l.dismiss()}},{text:TYPO3.lang["button.delete"],btnClass:"btn-danger",action:new n(()=>Promise.resolve(this.callAjaxAction("delete",i,s)))}])},this.undoRecord=e=>{const t=a.default(e.target).parents("tr"),s="TBODY"!==t.parent().prop("tagName");let i,r,d;if(s)i=this.markedRecordsForMassAction,r=TYPO3.lang["modal.massundo.text"],d=!0;else{const e=t.data("uid"),a=t.data("table"),s=t.data("recordtitle");i=[a+":"+e],d="pages"===a,r=d?TYPO3.lang["modal.undopage.text"]:TYPO3.lang["modal.undocontent.text"],r=this.createMessage(r,[s,"["+i[0]+"]"]),d&&t.data("parentDeleted")&&(r+=TYPO3.lang["modal.undo.parentpages"])}let c=null;c=d?a.default("<div />").append(a.default("<p />").text(r),a.default("<div />",{class:"form-check"}).append(a.default("<input />",{type:"checkbox",id:"undo-recursive",class:"form-check-input"}),a.default("<label />",{class:"form-check-label",for:"undo-recursive"}).text(TYPO3.lang["modal.undo.recursive"]))):a.default("<p />").text(r),l.confirm(TYPO3.lang["modal.undo.header"],c,o.ok,[{text:TYPO3.lang["button.cancel"],btnClass:"btn-default",trigger:function(){l.dismiss()}},{text:TYPO3.lang["button.undo"],btnClass:"btn-success",action:new n(()=>Promise.resolve(this.callAjaxAction("undo","object"==typeof i?i:[i],s,c.find("#undo-recursive").prop("checked"))))}])},a.default(()=>{this.initialize()})}static refreshPageTree(){top.document.dispatchEvent(new CustomEvent("typo3:pagetree:refresh"))}getElements(){this.elements={$searchForm:a.default(d.searchForm),$searchTextField:a.default(d.searchText),$searchSubmitBtn:a.default(d.searchSubmitBtn),$depthSelector:a.default(d.depthSelector),$tableSelector:a.default(d.tableSelector),$recyclerTable:a.default(d.recyclerTable),$tableBody:a.default(d.recyclerTable).find("tbody"),$paginator:a.default(d.paginator),$reloadAction:a.default(d.reloadAction),$massUndo:a.default(d.massUndo),$massDelete:a.default(d.massDelete)}}registerEvents(){this.elements.$searchForm.on("submit",e=>{e.preventDefault(),""!==this.elements.$searchTextField.val()&&this.loadDeletedElements()}),this.elements.$searchTextField.on("keyup",e=>{""!==a.default(e.currentTarget).val()?this.elements.$searchSubmitBtn.removeClass("disabled"):(this.elements.$searchSubmitBtn.addClass("disabled"),this.loadDeletedElements())}),this.elements.$searchTextField.get(0).clearable({onClear:()=>{this.elements.$searchSubmitBtn.addClass("disabled"),this.loadDeletedElements()}}),this.elements.$depthSelector.on("change",()=>{a.default.when(this.loadAvailableTables()).done(()=>{this.loadDeletedElements()})}),this.elements.$tableSelector.on("change",()=>{this.paging.currentPage=1,this.loadDeletedElements()}),new r.default("click",this.undoRecord).delegateTo(document,d.undo),new r.default("click",this.deleteRecord).delegateTo(document,d.delete),this.elements.$reloadAction.on("click",e=>{e.preventDefault(),a.default.when(this.loadAvailableTables()).done(()=>{this.loadDeletedElements()})}),this.elements.$paginator.on("click","[data-action]",e=>{e.preventDefault();const t=a.default(e.currentTarget);let s=!1;switch(t.data("action")){case"previous":this.paging.currentPage>1&&(this.paging.currentPage--,s=!0);break;case"next":this.paging.currentPage<this.paging.totalPages&&(this.paging.currentPage++,s=!0);break;case"page":this.paging.currentPage=parseInt(t.find("span").text(),10),s=!0}s&&this.loadDeletedElements()}),TYPO3.settings.Recycler.deleteDisable?this.elements.$massDelete.remove():this.elements.$massDelete.show(),new r.default("multiRecordSelection:checkbox:state:changed",this.handleCheckboxStateChanged).bindTo(document),new r.default("multiRecordSelection:action:massundo",this.undoRecord).bindTo(document),new r.default("multiRecordSelection:action:massdelete",this.deleteRecord).bindTo(document)}initialize(){s.default.configure({parent:".module-loading-indicator",showSpinner:!1}),this.getElements(),this.registerEvents(),TYPO3.settings.Recycler.depthSelection>0?this.elements.$depthSelector.val(TYPO3.settings.Recycler.depthSelection).trigger("change"):a.default.when(this.loadAvailableTables()).done(()=>{this.loadDeletedElements()})}resetMassActionButtons(){this.markedRecordsForMassAction=[],this.elements.$massUndo.find("span.text").text(TYPO3.lang["button.undo"]),this.elements.$massDelete.find("span.text").text(TYPO3.lang["button.delete"]),document.dispatchEvent(new CustomEvent("multiRecordSelection:actions:hide"))}loadAvailableTables(){return a.default.ajax({url:TYPO3.settings.ajaxUrls.recycler,dataType:"json",data:{action:"getTables",startUid:TYPO3.settings.Recycler.startUid,depth:this.elements.$depthSelector.find("option:selected").val()},beforeSend:()=>{s.default.start(),this.elements.$tableSelector.val(""),this.paging.currentPage=1},success:e=>{const t=[];this.elements.$tableSelector.children().remove(),a.default.each(e,(e,s)=>{const n=s[0],l=s[1],i=(s[2]?s[2]:TYPO3.lang.label_allrecordtypes)+" ("+l+")";t.push(a.default("<option />").val(n).text(i))}),t.length>0&&(this.elements.$tableSelector.append(t),""!==TYPO3.settings.Recycler.tableSelection&&this.elements.$tableSelector.val(TYPO3.settings.Recycler.tableSelection))},complete:()=>{s.default.done()}})}loadDeletedElements(){return a.default.ajax({url:TYPO3.settings.ajaxUrls.recycler,dataType:"json",data:{action:"getDeletedRecords",depth:this.elements.$depthSelector.find("option:selected").val(),startUid:TYPO3.settings.Recycler.startUid,table:this.elements.$tableSelector.find("option:selected").val(),filterTxt:this.elements.$searchTextField.val(),start:(this.paging.currentPage-1)*this.paging.itemsPerPage,limit:this.paging.itemsPerPage},beforeSend:()=>{s.default.start(),this.resetMassActionButtons()},success:e=>{this.elements.$tableBody.html(e.rows),this.buildPaginator(e.totalItems)},complete:()=>{s.default.done()}})}callAjaxAction(e,t,n,l=!1){let o={records:t,action:""},r=!1;if("undo"===e)o.action="undoRecords",o.recursive=l?1:0,r=!0;else{if("delete"!==e)return;o.action="deleteRecords"}return a.default.ajax({url:TYPO3.settings.ajaxUrls.recycler,type:"POST",dataType:"json",data:o,beforeSend:()=>{s.default.start()},success:e=>{e.success?i.success("",e.message):i.error("",e.message),this.paging.currentPage=1,a.default.when(this.loadAvailableTables()).done(()=>{this.loadDeletedElements(),n&&this.resetMassActionButtons(),r&&c.refreshPageTree()})},complete:()=>{s.default.done()}})}createMessage(e,t){return void 0===e?"":e.replace(/\{([0-9]+)\}/g,(function(e,a){return t[a]}))}buildPaginator(e){if(0===e)return void this.elements.$paginator.contents().remove();if(this.paging.totalItems=e,this.paging.totalPages=Math.ceil(e/this.paging.itemsPerPage),1===this.paging.totalPages)return void this.elements.$paginator.contents().remove();const t=a.default("<ul />",{class:"pagination"}),s=[],n=a.default("<li />",{class:"page-item"}).append(a.default("<button />",{class:"page-link",type:"button","data-action":"previous"}).append(a.default("<typo3-backend-icon />",{identifier:"actions-arrow-left-alt",size:"small"}))),l=a.default("<li />",{class:"page-item"}).append(a.default("<button />",{class:"page-link",type:"button","data-action":"next"}).append(a.default("<typo3-backend-icon />",{identifier:"actions-arrow-right-alt",size:"small"})));1===this.paging.currentPage&&n.disablePagingAction(),this.paging.currentPage===this.paging.totalPages&&l.disablePagingAction();for(let e=1;e<=this.paging.totalPages;e++){const t=a.default("<li />",{class:"page-item"+(this.paging.currentPage===e?" active":"")});t.append(a.default("<button />",{class:"page-link",type:"button","data-action":"page"}).append(a.default("<span />").text(e))),s.push(t)}t.append(n,s,l),this.elements.$paginator.html(t)}}return a.default.fn.disablePagingAction=function(){a.default(this).addClass("disabled").find("button").prop("disabled",!0)},new c}));