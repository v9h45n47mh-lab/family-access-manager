/* HA UI Kit 1.5.2 | MIT | Source priority: Shutter, Light, Essensplaner, Haushalt, Spuelmaschine, Access */
export const UI_VERSION = "1.5.2";
export const UI_CSS = ":host{--fui-font-body:14px;--fui-icon:21px;--fui-touch:40px;--fui-section-padding:10px;--fui-row-padding:4px}\n/* Shared ShadowRoot styles. Values follow Shutter Manager 1.4.0. */\n:host{display:block;color:var(--primary-text-color,#212121);font-family:var(--ha-font-family-body,Roboto,Arial,sans-serif);font-size:var(--fui-font-body);line-height:1.4}\n*{box-sizing:border-box}\nha-card,.ui-card{display:block;background:var(--ha-card-background,var(--card-background-color,#fff));border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color,#e0e0e0));border-radius:var(--ha-card-border-radius,12px);box-shadow:var(--ha-card-box-shadow,none);overflow:hidden}\nh3,h4,p{margin:0}h3{font-size:16px;font-weight:500}small,.hint{font-size:12px;line-height:1.5;color:var(--secondary-text-color,#727272)}\nbutton,input,select,textarea{font:inherit}\nbutton{color:var(--primary-color,#03a9f4);border:0;background:transparent;border-radius:var(--ha-button-border-radius,20px);padding:9px 14px;cursor:pointer;line-height:1.35;font-weight:500}\nbutton:hover{background:color-mix(in srgb,var(--primary-color,#03a9f4) 8%,transparent)}\nbutton:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--primary-color,#03a9f4);outline-offset:2px}\nbutton:disabled{opacity:.45;cursor:default}button:disabled:hover{background:transparent}\nbutton.primary{background:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff)}button.danger{color:var(--error-color,#db4437)}\nbutton>.ui-icon+span{margin-left:6px}\nbutton.compact{padding:7px 8px;min-height:var(--fui-touch)}\nbutton.compact>.ui-icon{width:16px;height:16px}\nbutton.compact>.ui-icon+span{margin-left:4px}\n.ui-icon{width:var(--fui-icon);height:var(--fui-icon);flex-shrink:0;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}\n.ui-icon.filled{fill:currentColor;stroke:none}.chevron{width:20px;height:20px;transform:rotate(-90deg);transition:transform .15s}.chevron.expanded{transform:rotate(0)}\n.card-top{display:flex;align-items:stretch;border-bottom:1px solid var(--divider-color,#e0e0e0);min-height:52px}\nnav{display:flex;flex:1;min-width:0;overflow-x:auto;scrollbar-width:none;padding:0 8px}nav::-webkit-scrollbar{display:none}\nnav button{flex-shrink:0;border-radius:0;border-bottom:2px solid transparent;color:var(--secondary-text-color,#727272);padding:16px 14px;white-space:nowrap;font-size:14px}\nnav button.selected{border-bottom-color:var(--primary-color,#03a9f4);color:var(--primary-color,#03a9f4)}\n.icon-tab{display:grid;place-items:center;width:48px;padding:10px!important}.icon-tab .ui-icon{width:24px;height:24px}\n.settings-button{width:48px;flex-shrink:0;display:grid;place-items:center;padding:12px;border-radius:0;color:var(--secondary-text-color,#727272)}\n.settings-button.selected{color:var(--primary-color,#03a9f4);background:color-mix(in srgb,var(--primary-color,#03a9f4) 8%,transparent)}.settings-button svg{width:24px;height:24px}\nmain{padding:8px 16px 16px}.toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}\n.page-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 0}.page-actions button{font-size:13px}\n.program-add{font-size:13px}\n.program-order{display:flex;gap:0}.program-order button{width:30px;height:34px;padding:4px;color:var(--primary-color,#03a9f4);font-size:18px;line-height:1}\n.filter-button{margin-right:auto;border:1px solid var(--divider-color,#e0e0e0);padding:6px 12px;align-self:center}\n.filter-button[aria-pressed=\"true\"]{background:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff);border-color:var(--primary-color,#03a9f4)}\n.edit-button{display:inline-flex;align-items:center;justify-content:center;min-width:var(--fui-touch);min-height:var(--fui-touch);padding:8px}.edit-button .ui-icon{width:20px;height:20px}\n.settings-group{padding:var(--fui-section-padding) 0;border-bottom:1px solid var(--divider-color,#e0e0e0)}.settings-group:last-child{border-bottom:0}\n.settings-heading-row{display:flex;align-items:center;justify-content:space-between;gap:16px}.settings-heading-row .settings-fold{flex:1;min-width:0}.settings-heading-row>button{flex-shrink:0;font-size:13px}\n.settings-fold{display:flex;align-items:center;gap:6px;width:100%;padding:0;color:var(--primary-text-color,#212121);text-align:left}.settings-fold span{font-size:14px;font-weight:500;overflow-wrap:anywhere}\n.setting-row{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:var(--fui-touch);padding:var(--fui-row-padding) 0;border-bottom:1px solid var(--divider-color,#e0e0e0)}.setting-row:last-child{border-bottom:0}\n.row-text{flex:1;min-width:0;overflow-wrap:anywhere}.row-text strong{font-size:13px;font-weight:500;line-height:1.35}.row-text small{display:block}.setting-row>.toolbar{gap:0;flex-shrink:0}\n.toggle{display:inline-flex;align-items:center;gap:9px;padding:6px 0;color:var(--primary-text-color,#212121);font-size:12px;font-weight:400;white-space:nowrap;min-height:40px}.toggle:hover{background:transparent}\n.switch-track{display:inline-flex;align-items:center;width:36px;height:20px;border-radius:12px;background:var(--switch-unchecked-track-color,#9e9e9e);padding:2px;flex-shrink:0}.switch-thumb{display:block;width:16px;height:16px;border-radius:50%;background:var(--switch-unchecked-button-color,#fff);box-shadow:0 1px 3px #0003;transition:transform .15s}\n.toggle.on .switch-track{background:color-mix(in srgb,var(--primary-color,#03a9f4) 50%,transparent)}.toggle.on .switch-thumb{transform:translateX(16px);background:var(--primary-color,#03a9f4)}\n.setting-row .toggle>span:last-child,.toggle.icon-only>span:last-child{display:none}\n.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.full{grid-column:1/-1}.field{display:flex;flex-direction:column;gap:6px;min-width:0;font-size:12px}.field>span{color:var(--secondary-text-color,#727272)}\ninput:not([type=checkbox]):not([type=range]),select,textarea{width:100%;min-width:0;border:1px solid var(--divider-color,#bdbdbd);border-radius:4px;padding:11px 10px;color:var(--primary-text-color,#212121);background:var(--input-fill-color,var(--secondary-background-color,#f5f5f5))}\ninput[type=checkbox]{width:18px;height:18px;accent-color:var(--primary-color,#03a9f4)}\n.modal{padding:0;width:800px;max-width:calc(100% - 48px);max-height:90vh;border:0;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);border-radius:var(--ha-dialog-border-radius,12px);box-shadow:0 8px 32px #0004}\n.modal[open]{display:flex;flex-direction:column}.modal::backdrop{background:#0006}\n.modal-head,footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 24px;flex-shrink:0}.modal-head{border-bottom:1px solid var(--divider-color,#e0e0e0)}.modal-head h3{font-size:20px;font-weight:400;overflow-wrap:anywhere}.modal-head button{color:var(--secondary-text-color,#727272)}.modal-body{padding:20px 24px;overflow-y:auto}footer{border-top:1px solid var(--divider-color,#e0e0e0);justify-content:flex-end;flex-wrap:wrap}\n.notice,.error{padding:12px 16px;font-size:13px}.notice{color:var(--secondary-text-color,#727272)}.error{color:var(--error-color,#db4437);background:color-mix(in srgb,var(--error-color,#db4437) 8%,transparent)}\n.version-info{font-size:12px;color:var(--secondary-text-color,#727272);margin-top:16px;overflow-wrap:anywhere}\n[hidden]{display:none!important}\n@media(max-width:600px){.card-top{min-height:48px}nav{padding:0 4px}nav button{padding:14px 8px;font-size:13px}.settings-button{width:42px;padding:9px}main{padding:4px 12px 12px}.settings-heading-row{gap:8px}.desktop-only{display:none!important}.modal{max-width:calc(100% - 16px);max-height:96vh;max-height:96dvh}.modal-head,footer{padding:12px 16px}.modal-head h3{font-size:18px}.modal-body{padding:16px}.grid{grid-template-columns:minmax(0,1fr)}.full{grid-column:auto}}\n@media(prefers-reduced-motion:reduce){.chevron,.switch-thumb{transition:none}}\n\n/* Geometry follows the source priority documented in COMPONENTS.md. */\n.fui-account-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}\n.fui-account-tile{aspect-ratio:1/1;min-width:0;min-height:0;position:relative;display:block;padding:16px;border:1px solid var(--divider-color,#e0e0e0);border-radius:var(--ha-card-border-radius,12px);background:var(--ha-card-background,var(--card-background-color,#fff));overflow:hidden}\n.fui-account-label{font-size:13px;font-weight:500;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left}\n.fui-account-balance{position:absolute;inset:0;padding:16px;min-width:0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--primary-text-color,#212121);pointer-events:none}\n.fui-account-value{max-width:100%;font-size:clamp(28px,7vw,48px);font-weight:500;line-height:1.1;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}\n.fui-account-unit{font-size:12px;line-height:1.5}\n.fui-account-description{position:absolute;left:16px;right:16px;bottom:16px;font-size:11px;line-height:1.35;color:var(--secondary-text-color,#727272);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.fui-account-tile.active .fui-account-balance{color:var(--primary-color,#03a9f4)}.fui-account-tile.success .fui-account-balance{color:var(--success-color,#2e7d32)}.fui-account-tile.warning .fui-account-balance{color:var(--warning-color,#f9a825)}.fui-account-tile.error .fui-account-balance{color:var(--error-color,#db4437)}\n@media(max-width:600px){.fui-account-tiles{gap:12px}.fui-account-tile,.fui-account-balance{padding:12px}.fui-account-description{left:12px;right:12px;bottom:12px}}\nfieldset{border:0;padding:0;margin:0;min-width:0}legend,.field-label{font-size:12px;color:var(--secondary-text-color,#727272);margin-bottom:6px}\n.field-error,.modal-save-error{color:var(--error-color,#db4437);font-size:13px;line-height:1.5}.fui-presets{margin-top:8px}.field-unit{align-self:flex-end}\n.check{display:flex;align-items:center;gap:8px;font-size:13px;min-height:32px}.check input{margin:0;flex-shrink:0}.fui-checks{display:flex;gap:8px 16px;flex-wrap:wrap}.fui-check-group{margin:8px 0}\n.fui-check-group .days{display:flex;flex-wrap:wrap;gap:6px}.fui-check-group .days label{position:relative;cursor:pointer}.fui-check-group .days input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.fui-check-group .days span{pointer-events:none;display:block;padding:8px 11px;border:1px solid var(--divider-color,#e0e0e0);border-radius:16px;font-size:12px}.fui-check-group .days input:checked+span{color:var(--primary-color,#03a9f4);background:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);border-color:transparent}.fui-check-group .days input:focus-visible+span{outline:2px solid var(--primary-color,#03a9f4)}.fui-check-group .days input:disabled+span{opacity:.45}\n.fui-combobox{position:relative}.fui-combobox .field input{padding-right:48px}.fui-combo-toggle{position:absolute;right:1px;top:22px}.fui-options{border:1px solid var(--divider-color,#bdbdbd);border-radius:4px;margin-top:4px;max-height:336px;overflow-y:auto;overscroll-behavior:contain}.fui-option{display:flex;flex-direction:column;align-items:flex-start;text-align:left;width:100%;height:56px;padding:8px 10px;border-radius:0;border-bottom:1px solid var(--divider-color,#e0e0e0)}.fui-option:last-of-type{border-bottom:0}.fui-option strong,.fui-option small{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fui-option.active,.fui-option[aria-selected=true]{background:color-mix(in srgb,var(--primary-color,#03a9f4) 8%,transparent)}.fui-options-empty{padding:12px;font-size:13px}\n.import-toolbar{margin:12px 0}.fui-multi>label{margin-top:12px}.fui-selection-list{margin-top:8px;max-height:400px;overflow-y:auto}.fui-selection-group h4{font-size:14px;font-weight:500;margin:12px 0 6px}.cover-option{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--divider-color,#e0e0e0);cursor:pointer}.cover-option>span{min-width:0;display:flex;flex-direction:column;gap:4px;overflow-wrap:anywhere}.cover-option strong{font-size:14px;font-weight:500}.cover-option:has(input:disabled){opacity:.6;cursor:default}\n.position-control{min-width:0;padding:6px 0}.slider-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px;font-size:13px}.slider-head label{color:var(--secondary-text-color,#727272)}.slider-head output{font-size:14px;font-weight:500;font-variant-numeric:tabular-nums}.position-control input[type=range]{appearance:none;-webkit-appearance:none;width:100%;display:block;height:4px;border:0;padding:0;margin:16px 0;border-radius:2px;cursor:pointer;accent-color:var(--primary-color,#03a9f4);background:linear-gradient(to right,var(--primary-color,#03a9f4) 0,var(--primary-color,#03a9f4) var(--range-percent),var(--divider-color,#ddd) var(--range-percent),var(--divider-color,#ddd) 100%)}.position-control input[type=range]::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:50%;background:var(--primary-color,#03a9f4)}.position-control input[type=range]::-moz-range-thumb{width:16px;height:16px;border:0;border-radius:50%;background:var(--primary-color,#03a9f4)}.slider-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--secondary-text-color,#727272);font-size:11px}.keep-value{font-size:11px;padding:4px 8px}.keep-value.selected{background:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent)}.position-control input:disabled{opacity:.45;cursor:default}\n.white-labels{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px}.white-control input[type=range]{background:linear-gradient(90deg,#d7e8ff,#fff6d7,#ffc77a)}\n.colour-control{display:flex;flex-direction:column;gap:10px}.colour-wheel{width:min(100%,340px);aspect-ratio:1;border-radius:50%;position:relative;touch-action:none;cursor:crosshair;background:radial-gradient(circle closest-side,#fff 0%,#ffffff00 100%),conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);flex-shrink:0}.colour-wheel:focus-visible{outline:2px solid var(--primary-color,#03a9f4);outline-offset:4px}.colour-wheel[aria-disabled=true]{opacity:.45;cursor:default}.colour-marker{position:absolute;width:18px;height:18px;border:2px solid white;box-shadow:0 0 0 1px #0009;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none}.colour-preview{display:flex;align-items:center;gap:8px;font-size:13px}.colour-preview>span{width:26px;height:26px;border:1px solid var(--divider-color,#ddd);border-radius:4px}\n.season-box{padding:8px 0}.season-dates{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;max-width:360px;margin:10px 0}.recurrence-controls{display:grid;gap:16px;margin-top:12px}.repeat-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.repeat-line input{max-width:80px}.repeat-line select{max-width:120px}\n.program-group{border-bottom:1px solid var(--divider-color,#e0e0e0)}.program-group-head{display:flex;width:100%;align-items:center;gap:8px;padding:12px 0;color:var(--primary-text-color,#212121);text-align:left;border-radius:4px}.program-group-head strong{font-size:16px;font-weight:500}.program-group-head>span:last-child{margin-left:auto;color:var(--secondary-text-color,#727272);font-size:12px}.program{padding:10px 0;border-bottom:1px solid var(--divider-color,#e0e0e0)}.program-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.program-heading{flex:1;min-width:0}.program-title{display:flex;align-items:center;gap:8px;padding:0;color:var(--primary-text-color,#212121);font-size:15px;text-align:left}.program-title span{overflow-wrap:anywhere}.program-title>.ui-icon+span{margin-left:0}.tags{display:flex;flex-wrap:wrap;gap:4px 10px;margin:6px 0 0 28px}.tags span{font-size:12px;color:var(--secondary-text-color,#727272)}.muted>.program-head,.muted>.ride-info{opacity:.55}.ride{display:flex;justify-content:space-between;gap:16px;padding:8px 0;margin-left:28px;border-top:1px solid var(--divider-color,#e0e0e0)}.ride-info{display:flex;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere}.ride-info strong{font-size:14px;font-weight:500}.ride-info>span{font-size:13px}.ride-actions{align-self:center}.subpanel{border:1px solid var(--divider-color,#e0e0e0);border-radius:8px;padding:16px;margin:12px 0}.ride-editor-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.ride-fold{display:flex;align-items:center;gap:8px;flex:1;min-width:0;padding:4px 0;text-align:left;color:var(--primary-text-color,#212121);border-radius:4px}.ride-fold-text{display:flex;flex-direction:column;gap:5px;min-width:0;overflow-wrap:anywhere}.ride-fold-text strong{font-size:14px;font-weight:500}.ride-fold-text>span{font-size:12px;line-height:1.5;color:var(--secondary-text-color,#727272)}.ride-editor-body{margin-top:16px;padding-top:16px;border-top:1px solid var(--divider-color,#e0e0e0)}\n.overview-panel{border-bottom:1px solid var(--divider-color,#e0e0e0)}.overview-toggle{display:flex;align-items:center;gap:6px;padding:10px 16px;color:var(--secondary-text-color,#727272);font-size:12px;border-radius:0}.overview{padding:0 16px 14px}.sun-row{display:flex;align-items:center;gap:28px;padding:4px 0 12px}.sun-value{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-variant-numeric:tabular-nums}.sun-value .ui-icon{color:var(--primary-color,#03a9f4)}.overview-group+.overview-group{margin-top:14px}.overview-group h4{font-size:11px;font-weight:500;color:var(--secondary-text-color,#727272);margin:0 0 8px}.sensor-grid{display:flex;flex-wrap:wrap;align-items:center;gap:9px 24px}.sensor-value{display:inline-flex;max-width:100%;align-items:center;gap:8px;min-width:0;font-size:13px;line-height:1.5}.sensor-label{min-width:0;overflow-wrap:anywhere}.sensor-state{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;font-variant-numeric:tabular-nums}.sensor-state .ui-icon{width:18px;height:18px;color:var(--secondary-text-color,#727272)}\n.daily-history-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:start;gap:10px;padding:10px 0;border-bottom:1px solid var(--divider-color,#e0e0e0);font-size:12px}.daily-history-row:last-child{border-bottom:0}.daily-history-row time{font-variant-numeric:tabular-nums}.daily-command{display:flex;flex-direction:column;gap:3px;min-width:0;overflow-wrap:anywhere}.daily-command strong{font-weight:500;font-size:13px}.daily-command small{font-size:12px}.command-result{display:flex;align-items:center;gap:4px;white-space:nowrap;font-size:11px}.command-result .ui-icon{width:16px;height:16px}.completed .command-result{color:var(--success-color,#2e7d32)}.failed .command-result{color:var(--error-color,#db4437)}.pending .command-result{color:var(--secondary-text-color,#727272)}.failure-reason{overflow-wrap:anywhere}.fui-history-month{margin-left:8px}\n.fui-status-tag{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--secondary-text-color,#727272);margin-right:10px}.fui-status-tag.active{color:var(--primary-color,#03a9f4)}.fui-status-tag.success{color:var(--success-color,#2e7d32)}.fui-status-tag.error{color:var(--error-color,#db4437)}.fui-status-tag.warning{color:var(--warning-color,#f9a825)}.fui-status-tag .ui-icon{width:16px;height:16px}.fui-counter{font-size:12px;color:var(--secondary-text-color,#727272);white-space:nowrap}\n.fui-statistics{overflow-x:auto}.fui-statistics table{width:100%;border-collapse:collapse;font-size:13px}.fui-statistics th,.fui-statistics td{padding:var(--fui-row-padding) 0;border-bottom:1px solid var(--divider-color,#e0e0e0);text-align:left;overflow-wrap:anywhere}.fui-statistics .numeric{text-align:right}.fui-statistics tfoot{font-weight:500}\n.week{display:flex;align-items:center;gap:8px;margin:8px 0}.week strong{flex:1;min-width:0;text-align:center;font-size:14px}.calendar-row{display:grid;grid-template-columns:44px minmax(0,1fr);gap:8px;align-items:center;border-bottom:1px solid var(--divider-color,#e0e0e0);padding:4px 0}.day-date{display:grid;text-align:center}.calendar-content{min-width:0}.calendar-content .setting-row{border:0}.meal-link{display:inline-block;color:var(--primary-color,#03a9f4);margin-bottom:4px}.calendar-row.empty{line-height:inherit}.calendar-row.empty .row-text strong{color:var(--secondary-text-color,#727272)}.fui-calendar.fui-check-group .days{display:block}.checks{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}.assignee{font-size:12px;color:var(--secondary-text-color,#727272)}.complete{display:grid;place-items:center;min-width:40px;min-height:40px;cursor:pointer}.completed .row-text strong,.assignee.completed{text-decoration:line-through;color:var(--secondary-text-color,#727272)}\n.language-picker{display:flex;gap:8px}.language-picker button{min-width:70px;border:1px solid var(--divider-color,#e0e0e0);color:var(--primary-text-color,#212121);border-radius:var(--ha-button-border-radius,20px)}.language-picker button[aria-pressed=true]{border-color:var(--primary-color,#03a9f4);background:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);color:var(--primary-color,#03a9f4)}.language-picker button span{font-size:12px;font-weight:600}.backup-actions{margin-top:12px}\n.howto{line-height:1.6;font-size:14px;padding:12px 0}.howto h2{font-size:20px;font-weight:400;margin:0 0 14px}.howto h3{font-size:16px;margin:24px 0 10px}.howto p{margin:10px 0}.howto ul,.howto ol{padding-left:22px;margin:10px 0}.howto li{margin:8px 0}.howto table{width:100%;border-collapse:collapse;font-size:13px}.howto th,.howto td{padding:10px 8px;border-bottom:1px solid var(--divider-color,#e0e0e0);text-align:left;vertical-align:top}\n.fui-panel-header{min-height:64px;background:var(--ha-card-background,var(--card-background-color,#fff));border-bottom:1px solid var(--divider-color,#e0e0e0);display:flex;align-items:center;padding:0 24px;gap:12px;position:sticky;top:0;z-index:5;flex-wrap:wrap}.fui-panel-header strong{font-size:20px;font-weight:500}.fui-panel-header .grow{flex:1}\n.fui-feedback{padding:12px 16px;font-size:13px;line-height:1.5;overflow-wrap:anywhere}.fui-feedback.info{color:var(--secondary-text-color,#727272)}.fui-feedback.error{color:var(--error-color,#db4437);background:color-mix(in srgb,var(--error-color,#db4437) 8%,transparent)}.fui-feedback.warning{color:var(--primary-text-color,#212121);border-left:4px solid var(--warning-color,#f9a825);background:color-mix(in srgb,var(--warning-color,#f9a825) 8%,transparent)}.fui-feedback.success{color:var(--success-color,#2e7d32)}.empty:not(.calendar-row){padding:24px 0;color:var(--secondary-text-color,#727272);line-height:1.6}.modal-save-error{margin:0 0 4px}.gm-photo-box{display:grid;gap:8px}.photo-preview{display:block;max-width:100%;max-height:300px;object-fit:contain;margin:auto}.gm-photo-large{display:block;width:100%;max-height:70dvh;object-fit:contain}\n.visually-hidden{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n@media(max-width:600px){.fui-check-group .days{gap:5px}.fui-check-group .days span{padding:8px 10px}.program-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px 8px}.program-heading{display:contents}.program-title{grid-column:1;grid-row:1;min-width:0}.program-head>.toolbar{grid-column:2;grid-row:1;justify-self:end;gap:4px;flex-wrap:nowrap}.program-head .tags{grid-column:1/-1;grid-row:2;margin-top:0}.ride{gap:10px}.ride-editor-head{align-items:flex-start;flex-wrap:wrap;gap:8px}.ride-fold{flex-basis:100%}.ride-editor-actions{margin-left:28px;justify-content:flex-end;flex:1}.subpanel{padding:12px}.ride-editor-body{margin-top:12px;padding-top:12px}.fui-panel-header{padding:8px 12px;gap:8px}.fui-panel-header strong{font-size:17px}.fui-panel-header>button{font-size:12px;padding:9px}.week{gap:4px}.week strong{font-size:13px}}\n@media(max-width:380px){.daily-history-row{gap:6px;grid-template-columns:36px minmax(0,1fr) auto}.command-result{font-size:10px}}\n\n.ride-actions.inline-actions{flex-wrap:nowrap;flex-shrink:0}\n\n/* Skipped occurrence: theme-owned muted text; controls remain fully usable. */\n.ride.skipped>.ride-info{color:var(--disabled-text-color,#9e9e9e)}\n.ride.skipped>.ride-info small{color:inherit}\n";
// Source paths: Shutter Manager 1.4.0. See docs/PROVENANCE.json.
const ICON_PATHS = Object.freeze({
  "sunrise": "<path d=\"M2 17h20M5 21h14M7 17a5 5 0 0 1 10 0M4 12l-2-2m18 2 2-2M12 9V2m-3 3 3-3 3 3\"/>",
  "sunset": "<path d=\"M2 17h20M5 21h14M7 17a5 5 0 0 1 10 0M4 12l-2-2m18 2 2-2M12 2v7m-3-3 3 3 3-3\"/>",
  "lock": "<rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"2\"/><path d=\"M8 10V6a4 4 0 0 1 8 0v4m-4 5v2\"/>",
  "unlock": "<rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"2\"/><path d=\"M8 10V6a4 4 0 0 1 7.5-2M12 15v2\"/>",
  "temperature": "<path d=\"M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0M12 8v10\"/><circle cx=\"12\" cy=\"18\" r=\"1\"/>",
  "illuminance": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5\"/>",
  "skip-once": "<path d=\"m6 5 10 7-10 7V5ZM19 5v14\"/>",
  "restore-schedule": "<path d=\"M3 11a9 9 0 1 1 3 8M3 4v7h7M12 7v5l3 2\"/>" ,
  "reschedule": "<circle cx=\"10\" cy=\"10\" r=\"7\"/><path d=\"M10 6v4l3 2m1 6h7m-3-3 3 3-3 3\"/>",
  "schedule": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 6v6l4 2\"/>",
  "sensors": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M6.3 6.3a8 8 0 0 0 0 11.4m11.4-11.4a8 8 0 0 1 0 11.4M3.5 3.5a12 12 0 0 0 0 17m17-17a12 12 0 0 1 0 17\"/>",
  "success": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m7 12 3 3 7-7\"/>",
  "failure": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v6m0 4h.01\"/>",
  "trash": "<path d=\"M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6\"/>",
  "move": "<path d=\"M14 4H4v16h10M10 12h12m-4-4 4 4-4 4\"/>",
  "copy": "<rect x=\"8\" y=\"8\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"M16 8V3H3v13h5\"/>",
  "edit": "<path d=\"M4 16l12-12 4 4L8 20H4v-4M14 6l4 4\"/>",
  "unknown": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 8a2 2 0 1 1 3 2c-1 .5-1 1-1 2m0 4h.01\"/>",
  "settings": "<path d=\"M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.63l-1.92-3.32a.49.49 0 0 0-.6-.22l-2.39.96a7.1 7.1 0 0 0-1.62-.94l-.36-2.54a.49.49 0 0 0-.49-.42h-3.84a.49.49 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.49.49 0 0 0-.6.22L2.68 8.85a.49.49 0 0 0 .12.63l2.03 1.58a7.3 7.3 0 0 0 0 1.88L2.8 14.52a.49.49 0 0 0-.12.63l1.92 3.32c.12.22.38.31.6.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.04.24.24.42.49.42h3.84c.25 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.48 0 .6-.22l1.92-3.32a.49.49 0 0 0-.12-.63zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z\"/>",
  "help": "<path d=\"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-3h2v-2h-2v2zm1-11a4 4 0 0 0-4 4h2a2 2 0 1 1 4 0c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 0 0-4-4z\"/>",
  "chevron": "<path d=\"M4 6l4 4 4-4\"/>",
  "add": "<path d=\"M12 5v14M5 12h14\"/>",
  "close": "<path d=\"m6 6 12 12M6 18 18 6\"/>",
  "save": "<path d=\"M5 3h12l4 4v14H3V3h2M7 3v6h10V3M7 21v-8h10v8\"/>",
  "up": "<path d=\"m5 15 7-7 7 7\"/>",
  "left": "<g transform=\"rotate(-90 12 12)\"><path d=\"m5 15 7-7 7 7\"/></g>",
  "right": "<g transform=\"rotate(90 12 12)\"><path d=\"m5 15 7-7 7 7\"/></g>",
  "menu": "<path d=\"M4 6h16M4 12h16M4 18h16\"/>",
  "down": "<path d=\"m5 9 7 7 7-7\"/>",
  "media-alarmFilled": "<path fill-rule=\"evenodd\" d=\"M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-1 3h2v4.4l3 1.8-1 1.7-4-2.4V7ZM3.5 1.8l1.3 1.5-3.4 2.9L.1 4.7l3.4-2.9Zm17 0 3.4 2.9-1.3 1.5-3.4-2.9 1.3-1.5Z\"/>",
  "media-alarm": "<path fill-rule=\"evenodd\" d=\"M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm-1 1h2v5.4l3 1.8-1 1.7-4-2.4V7ZM3.5 1.8l1.3 1.5-3.4 2.9L.1 4.7l3.4-2.9Zm17 0 3.4 2.9-1.3 1.5-3.4-2.9 1.3-1.5Z\"/>",
  "media-previous": "<path fill-rule=\"evenodd\" d=\"M6 5h2v14H6zM18 5v14l-9-7z\"/>",
  "media-next": "<path fill-rule=\"evenodd\" d=\"M16 5h2v14h-2zM6 5l9 7-9 7z\"/>",
  "media-play": "<path fill-rule=\"evenodd\" d=\"M8 5v14l11-7z\"/>",
  "media-pause": "<path fill-rule=\"evenodd\" d=\"M6 5h4v14H6zM14 5h4v14h-4z\"/>",
  "media-stop": "<path fill-rule=\"evenodd\" d=\"M6 6h12v12H6z\"/>",
  "media-star": "<path fill-rule=\"evenodd\" d=\"m12 2.5 2.9 5.9 6.5 1-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-1z\"/>",
  "media-radio": "<path fill-rule=\"evenodd\" d=\"M4 7h16v13H4zM6 3l13-2v2L6 5zM6 9v3h12V9zM7 14h5v4H7zM15 14h3v2h-3z\"/>",
  "media-shuffle": "<path fill-rule=\"evenodd\" d=\"m16 3 5 4-5 4V8h-2l-4 5-4 5H3v-2h2l4-5 4-5h3V3ZM3 6h3l3 4-1.3 1.6L5 8H3V6Zm9 7.4 2 2.6h2v-3l5 4-5 4v-3h-3l-2.3-3 1.3-1.6Z\"/>",
  "media-music": "<path fill-rule=\"evenodd\" d=\"M16 3v11.6a4 4 0 1 0 2 3.4V7h4V3h-6ZM8 6H2v2h6V6Zm0 5H2v2h6v-2Zm-2 5H2v2h4v-2Z\"/>"
});
export const ICON_NAMES = Object.freeze(Object.keys(ICON_PATHS));
export function icon(name, {expanded = false} = {}) {
  if (!Object.hasOwn(ICON_PATHS, name)) throw new TypeError(`Unknown icon: ${name}`);
  const filled = name === 'settings' || name === 'help' || name.startsWith('media-');
  const chevron = name === 'chevron';
  return `<svg class="ui-icon${filled ? ' filled' : ''}${chevron ? ' chevron' : ''}${chevron && expanded ? ' expanded' : ''}" data-icon="${name}" viewBox="0 0 ${chevron ? '16 16' : '24 24'}" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`;
}

export const MUSIC_PLAYER_CSS = "\n  :host{min-width:0}\n  .music-stack,.music-browser,.music-editor{display:grid;gap:16px;min-width:0}\n  .music-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;min-width:0;padding-bottom:12px;border-bottom:1px solid var(--divider-color,#e0e0e0)}\n  .music-now-playing{flex:1;min-width:0}\n  .music-title{margin:0;font-size:22px;font-weight:600;line-height:1.25;color:var(--primary-text-color,#212121);overflow-wrap:anywhere}\n  .music-detail{margin-top:6px;font-size:13px;line-height:1.4;color:var(--secondary-text-color,#727272);overflow-wrap:anywhere}\n  .music-box{flex:0 1 auto;min-width:0;max-width:38%;text-align:end;font-size:13px;font-weight:500;line-height:1.4;color:var(--secondary-text-color,#727272);overflow-wrap:anywhere}\n  .music-controls{display:grid;gap:12px;min-width:0}\n  .music-transport{display:flex;gap:12px}\n  .music-transport button{flex:1;min-width:0;height:44px;display:grid;place-items:center;padding:0;border-radius:12px;background:var(--secondary-background-color,#f2f2f2);color:var(--primary-text-color,#212121)}\n  .music-transport button:disabled{color:var(--disabled-text-color,#bdbdbd);opacity:1}\n  .music-transport button:hover:enabled{background:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,var(--secondary-background-color,#f2f2f2))}\n  .music-icon{width:20px;height:20px;fill:currentColor;vertical-align:middle}\n  .music-volume{min-width:0}\n  .music-volume ha-control-slider{display:block;width:100%}\n  .music-apple-playback{display:grid;gap:8px;min-width:0}\n  .music-transport [data-action=\"shuffle\"][aria-pressed=\"true\"]{color:var(--primary-color,#03a9f4);background:color-mix(in srgb,var(--primary-color,#03a9f4) 14%,transparent)}\n  #music-seek-control .slider-head label{display:none}\n  #music-seek-control .slider-head{justify-content:flex-end}\n  .music-favorites:empty,#music-favorite-status:empty,#music-player-status:empty{display:none}\n  .music-apple-results [aria-pressed=\"false\"] .music-icon,#music-radio-results [aria-pressed=\"false\"] .music-icon{fill:none;stroke:currentColor;stroke-width:1.7}\n  .music-favorites{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:12px;min-width:0}\n  .music-favorite{display:grid;gap:6px;align-content:start;justify-items:center;min-width:0;min-height:80px;padding:8px;border-radius:12px;background:var(--secondary-background-color,#f2f2f2)}\n  .music-favorite>span:last-child{max-width:100%;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n  .music-station-logo{position:relative;display:grid;place-items:center;width:48px;height:48px;flex-shrink:0;border-radius:8px;background:var(--card-background-color,#fff);color:var(--secondary-text-color,#727272);overflow:hidden}\n  .music-station-logo img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:var(--card-background-color,#fff)}\n  .music-station-row{display:flex;align-items:center;gap:12px;min-width:0}\n  .music-station-row>.setting-row{flex:1;min-width:0}\n  .music-favorite-actions{display:flex;align-items:center;gap:4px;flex-wrap:nowrap}\n  .music-apple-logo{display:block;width:48px;height:48px;flex-shrink:0;border-radius:10px}\n  .music-apple-results .setting-row{min-width:0}\n  .music-results{min-width:0;display:grid;gap:12px}\n  .music-search-line{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:8px}\n  .music-library-nav,.music-manage-nav{display:grid;gap:8px;min-width:0}\n  .music-library-nav{grid-template-columns:repeat(3,minmax(0,1fr))}\n  .music-manage-nav{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .music-library-nav button{border:1px solid var(--divider-color,#ddd)}\n  .music-library-nav button[aria-pressed=\"true\"]{background:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff);border-color:var(--primary-color,#03a9f4)}\n  .music-catalog-item{display:grid;gap:12px;padding:12px;border:1px solid var(--divider-color,#ddd);border-radius:12px;min-width:0}\n  .music-result-actions{display:grid;grid-template-columns:44px 44px minmax(0,1fr);gap:8px;align-items:stretch}\n  .music-result-actions.is-container{grid-template-columns:44px minmax(0,1fr) minmax(0,1fr)}\n  .music-result-actions.is-radio{grid-template-columns:44px minmax(0,1fr)}\n  .music-result-actions button{padding:8px;min-width:0}\n  .music-result-actions .music-icon{width:22px;height:22px}\n  .music-result-actions [data-action=\"apple-alarm-song\"] .music-icon{fill:currentColor;stroke:none}\n  .music-song-actions{display:flex;justify-content:flex-end}\n  .music-song-actions button{min-width:100px}\n  #music-apple-account:empty,#music-apple-status:empty{display:none}\n  #music-alarm-song-tools{display:grid;gap:12px}\n  .music-source-actions button{min-height:44px}\n  @media(max-width:600px){\n    .music-source-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}\n    .music-source-actions button{border:1px solid var(--divider-color,#ddd);padding:8px}\n    .music-favorites{grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:10px}\n    .music-favorite{min-height:104px}\n    .music-transport{gap:8px}\n    .music-transport button{height:48px}\n    .music-browser{gap:12px}\n    .music-manage-nav button{padding:8px}\n    #music-search-form>.toolbar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}\n    #music-search-form [data-action=\"manage-favorites\"]{grid-column:1/-1}\n    .music-favorite-actions{flex-wrap:wrap}\n    .music-favorite-actions .program-order button{width:44px;height:44px}\n    .music-favorite-actions .check{min-height:44px;min-width:44px;display:grid;place-items:center}\n  }\n\n  .modal{max-height:90dvh}\n  .modal .modal-body{min-height:0;flex:1;overscroll-behavior:contain}\n  .modal footer:empty{display:none}\n  .modal button{min-height:44px}\n  .modal .modal-head .edit-button{min-width:44px}\n  .modal .row-text{min-width:0;overflow-wrap:anywhere}\n  @media(max-width:600px){\n    .modal{inset:0;margin:0;width:100%;max-width:100%;height:100dvh;max-height:100dvh;border-radius:0}\n    .modal .modal-head{padding:calc(8px + env(safe-area-inset-top,0px)) 12px 8px 16px}\n    .modal .modal-body{padding:16px 16px calc(20px + env(safe-area-inset-bottom,0px))}\n    .modal input:not([type=range]):not([type=checkbox]){font-size:16px;min-height:44px}\n  }\n\n/* Canonical music player presentation. Applications do not override these rules. */\n.fui-player-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;min-width:0}\n.fui-player-speaker{width:190px;max-width:calc(100% - 64px);min-width:0}\n.fui-player-speaker select{width:100%;min-width:0}\n.fui-player-name{min-width:0;overflow-wrap:anywhere;color:var(--secondary-text-color,#727272)}\n.fui-player-settings{width:48px;height:48px;flex-shrink:0;border-radius:50%;padding:12px;color:var(--secondary-text-color,#727272)}\n.fui-player-settings .ui-icon{width:24px;height:24px}\n.fui-player-heading{display:grid;grid-template-columns:80px minmax(0,1fr);align-items:center;gap:16px;padding:8px 0 16px;border-bottom:1px solid var(--divider-color,#ddd)}\n.fui-player-heading h3{font-size:20px;font-weight:500;line-height:1.3;overflow-wrap:anywhere}\n.fui-player-heading small{display:block;margin-top:6px;overflow-wrap:anywhere}\n.fui-music-artwork{position:relative;display:grid;place-items:center;flex-shrink:0;width:48px;height:48px;border-radius:8px;overflow:hidden;background:var(--secondary-background-color,#f2f2f2);color:var(--primary-color,#03a9f4)}\n.fui-music-artwork img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n.fui-player-heading .fui-music-artwork{width:80px;height:80px;border-radius:12px}\n.fui-player-heading .fui-music-artwork .ui-icon{width:40px;height:40px}\n.fui-music-transport{display:flex;align-items:center;justify-content:center;gap:12px}\n.fui-music-transport button{display:grid;place-items:center;flex:0 0 48px;width:48px;height:48px;padding:12px;border-radius:50%}\n.fui-music-transport .fui-music-play{flex-basis:56px;width:56px;height:56px;padding:16px;background:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff)}\n.fui-music-transport .fui-music-play:hover:enabled{background:var(--primary-color,#03a9f4)}\n.fui-music-transport [aria-pressed=\"true\"]{background:color-mix(in srgb,var(--primary-color,#03a9f4) 14%,transparent)}\n.music-favorites{display:grid;grid-template-columns:repeat(auto-fill,64px);gap:10px}\n.music-favorites .fui-music-favorite{display:grid;place-items:center;width:64px;height:64px;min-width:64px;min-height:64px;padding:8px;border-radius:12px;background:var(--secondary-background-color,#f2f2f2)}\n.music-manage-nav{grid-template-columns:minmax(0,1fr)}\n.music-apple-results.no-alarm-songs .music-result-actions:not(.is-container){grid-template-columns:44px minmax(0,1fr)}\n.fui-player-navigation-status:empty{display:none}\n.fui-player-song-tools{display:grid;gap:12px}\n.fui-player-song-list{display:grid;gap:8px;min-width:0}\n.fui-player-settings-list{display:grid;gap:0}\n@media(max-width:360px){.fui-player-heading{grid-template-columns:64px minmax(0,1fr);gap:12px}.fui-player-heading .fui-music-artwork{width:64px;height:64px}.fui-music-transport{gap:8px}}\n\n.modal .edit-button{width:44px;height:44px;min-width:44px;border-radius:50%}\n\n.fui-player-speaker-compact{width:150px}\n";

/** Text/attribute escaping; content parameters explicitly accept trusted application markup. */
export function escapeHtml(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function dataAttrs(data = {}) {
  return Object.entries(data).map(([key, value]) => {
    if (!/^[a-z][a-z0-9-]*$/.test(key)) throw new TypeError(`Invalid data attribute: ${key}`);
    return ` data-${key}="${escapeHtml(value)}"`;
  }).join('');
}

function actionAttrs(action, data) {
  if (Object.hasOwn(data || {}, 'action')) throw new TypeError('Use the action argument for data-action');
  return ` data-action="${escapeHtml(action)}"${dataAttrs(data)}`;
}

export function button({label, action, icon: name, variant = 'text', disabled = false, compact = false, data = {}}) {
  if (!['text', 'primary', 'danger'].includes(variant)) throw new TypeError('Unknown button variant');
  return `<button type="button" class="${[variant === 'text' ? '' : variant,compact?'compact':''].filter(Boolean).join(' ')}"${actionAttrs(action, data)}${disabled ? ' disabled' : ''}>${name ? icon(name) : ''}<span>${escapeHtml(label)}</span></button>`;
}

/** Shutter Manager's text plus is intentional: do not substitute the generic add SVG. */
export function programAddButton({label = 'Programm', action = 'new-program', disabled = false, data = {}} = {}) {
  return `<button type="button" class="primary program-add"${actionAttrs(action, data)}${disabled ? ' disabled' : ''}>+ ${escapeHtml(label)}</button>`;
}

/** Controlled ordering: index/count refer to the sortable group, not the whole list. */
export function programOrderButtons({programId, index, count, action = 'move-program', disabled = false, desktopOnly = true, upLabel = 'Nach oben sortieren', downLabel = 'Nach unten sortieren'}) {
  if (typeof programId !== 'string' || !programId) throw new TypeError('Ordering requires a program ID');
  if (!Number.isInteger(index) || !Number.isInteger(count) || count < 1 || index < 0 || index >= count) throw new RangeError('Ordering requires 0 <= index < count');
  const control = (direction, label, glyph, atBoundary) => `<button type="button"${actionAttrs(action, {program:programId, direction})} title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"${disabled || atBoundary ? ' disabled' : ''}>${glyph}</button>`;
  return `<div class="program-order${desktopOnly ? ' desktop-only' : ''}">${control('up', upLabel, '↑', index === 0)}${control('down', downLabel, '↓', index === count - 1)}</div>`;
}

export function iconButton({icon: name, label, action, disabled = false, danger = false, data = {}, desktopOnly = false}) {
  if (!label) throw new TypeError('Icon buttons require a label');
  return `<button type="button" class="edit-button${danger ? ' danger' : ''}${desktopOnly ? ' desktop-only' : ''}"${actionAttrs(action, data)} aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"${disabled ? ' disabled' : ''}>${icon(name)}</button>`;
}

export function navigation({label, items, active, settings = true, help = true, settingsLabel = 'Einstellungen', helpLabel = 'Anleitung'}) {
  const navButton = (item, cls = '') => `<button type="button" class="${cls}${item.id === active ? ' selected' : ''}"${actionAttrs('navigate', {page:item.id})} aria-current="${item.id === active ? 'page' : 'false'}"${item.icon ? ` aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}"` : ''}>${item.icon ? icon(item.icon) : escapeHtml(item.label)}</button>`;
  return `<div class="card-top"><nav aria-label="${escapeHtml(label)}">${items.map(item => navButton(item, item.icon ? 'icon-tab' : '')).join('')}</nav>${help ? navButton({id:'help', label:helpLabel, icon:'help'}, 'settings-button') : ''}${settings ? navButton({id:'settings', label:settingsLabel, icon:'settings'}, 'settings-button') : ''}</div>`;
}

export function toggle({label, action, checked = false, disabled = false, data = {}, iconOnly = false}) {
  return `<button type="button" class="toggle${checked ? ' on' : ''}${iconOnly ? ' icon-only' : ''}" role="switch" aria-checked="${Boolean(checked)}" aria-label="${escapeHtml(label)}"${actionAttrs(action, data)}${disabled ? ' disabled' : ''}><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span><span>${escapeHtml(label)}</span></button>`;
}

export function filterButton({label, action, selected = false, data = {}}) {
  return `<button type="button" class="filter-button"${actionAttrs(action, data)} aria-pressed="${Boolean(selected)}">${escapeHtml(label)}</button>`;
}

/** id must be unique within the card's ShadowRoot. trailing/content are trusted markup. */
export function section({id, title, content = '', trailing = '', expanded = true}) {
  if (!id || /\s/.test(id)) throw new TypeError('Section requires a nonempty ID without whitespace');
  return `<section class="settings-group" data-settings="${escapeHtml(id)}"><div class="settings-heading-row"><button type="button" class="settings-fold" data-ui="collapse" aria-expanded="${Boolean(expanded)}" aria-controls="${escapeHtml(id)}-content">${icon('chevron', {expanded})}<span>${escapeHtml(title)}</span></button>${trailing}</div><div id="${escapeHtml(id)}-content"${expanded ? '' : ' hidden'}>${content}</div></section>`;
}

export function row({title, description = '', trailing = ''}) {
  return `<div class="setting-row"><div class="row-text"><strong>${escapeHtml(title)}</strong>${description ? `<small>${escapeHtml(description)}</small>` : ''}</div><div class="toolbar">${trailing}</div></div>`;
}

export function field({id, label, value = '', type = 'text', required = false, disabled = false, name, min, max, step, placeholder, maxLength, inputMode, autocomplete, unit = '', hint = '', error = ''}) {
  if (!['text','number','time','date','email','search','url'].includes(type)) throw new TypeError('Unsupported field type');
  const attrs = Object.entries({name,min,max,step,placeholder,maxlength:maxLength,inputmode:inputMode,autocomplete}).filter(([,v])=>v!==undefined).map(([k,v])=>` ${k}="${escapeHtml(v)}"`).join('');
  const described = [hint && id+'-hint',error && id+'-error'].filter(Boolean).join(' ');
  return `<label class="field" for="${escapeHtml(id)}"><span>${escapeHtml(label)}</span><input id="${escapeHtml(id)}" type="${type}" value="${escapeHtml(value)}"${attrs}${required ? ' required' : ''}${disabled ? ' disabled' : ''}${error ? ' aria-invalid="true"' : ''}${described ? ` aria-describedby="${escapeHtml(described)}"` : ''}>${unit?`<small class="field-unit">${escapeHtml(unit)}</small>`:''}${hint?`<small id="${escapeHtml(id)}-hint">${escapeHtml(hint)}</small>`:''}${error?`<small class="field-error" id="${escapeHtml(id)}-error" role="alert">${escapeHtml(error)}</small>`:''}</label>`;
}

export function selectField({id, label, value = '', options, disabled = false, name, required = false, hint = '', error = '', hideLabel = false}) {
  const render = option => option.options ? `<optgroup label="${escapeHtml(option.label)}">${option.options.map(render).join('')}</optgroup>` : `<option value="${escapeHtml(option.value)}"${String(option.value) === String(value) ? ' selected' : ''}${option.disabled?' disabled':''}>${escapeHtml(option.label)}</option>`;
  return `<label class="field" for="${escapeHtml(id)}"><span${hideLabel?' class="visually-hidden"':''}>${escapeHtml(label)}</span><select id="${escapeHtml(id)}"${name?` name="${escapeHtml(name)}"`:''}${disabled ? ' disabled' : ''}${required?' required':''}${error?' aria-invalid="true"':''}${hint||error?` aria-describedby="${escapeHtml(id)}-help"`:''}>${options.map(render).join('')}</select>${hint||error?`<small id="${escapeHtml(id)}-help" class="${error?'field-error':''}"${error?' role="alert"':''}>${escapeHtml(error||hint)}</small>`:''}</label>`;
}

/** A native modal: call showModal() after inserting it. Escape and focus stay native. */
export function dialog({id, title, content, actions = '', closeLabel = 'Schließen'}) {
  return `<dialog id="${escapeHtml(id)}" class="modal" aria-labelledby="${escapeHtml(id)}-title"><div class="modal-head"><h3 id="${escapeHtml(id)}-title">${escapeHtml(title)}</h3><button type="button" class="edit-button" data-ui="close-dialog" aria-label="${escapeHtml(closeLabel)}" title="${escapeHtml(closeLabel)}">${icon('close')}</button></div><div class="modal-body">${content}</div><footer>${actions}</footer></dialog>`;
}

export function notice(message, {error = false} = {}) {
  return `<div class="${error ? 'error' : 'notice'}" role="${error ? 'alert' : 'status'}">${escapeHtml(message)}</div>`;
}

export function versionInfo({frontend, backend, ui, label = 'Oberfläche', backendLabel = 'Integration'}) {
  return `<p class="version-info">${escapeHtml(label)} ${escapeHtml(frontend)}${backend ? ` · ${escapeHtml(backendLabel)} ${escapeHtml(backend)}` : ''}${ui ? ` · UI ${escapeHtml(ui)}` : ''}</p>`;
}

/** Bind once per ShadowRoot; the returned function removes the listener on disconnect. */
export function bindUI(root, onAction = () => {}) {
  const unbindObjects = bindObjects(root, onAction);
  const handleClick = event => {
    const target = event.target.closest?.('button');
    if (!target || !root.contains(target) || target.disabled) return;
    if (target.dataset.ui === 'collapse') {
      const content = root.getElementById(target.getAttribute('aria-controls'));
      if (!content) return;
      const expanded = target.getAttribute('aria-expanded') !== 'true';
      target.setAttribute('aria-expanded', String(expanded));
      content.hidden = !expanded;
      target.querySelector('.chevron')?.classList.toggle('expanded', expanded);
      return;
    }
    if (target.dataset.ui === 'close-dialog') {
      target.closest('dialog')?.close();
      return;
    }
    if (!target.hasAttribute('data-action')) return;
    // Controlled components: the integration decides whether to commit the change.
    const checked = target.getAttribute('role') === 'switch' ? target.getAttribute('aria-checked') !== 'true' : undefined;
    onAction({action:target.dataset.action, data:{...target.dataset}, checked, element:target, originalEvent:event});
  };
  root.addEventListener('click', handleClick);
  const handleKeydown = event => {
    if (event.key !== 'Tab') return;
    const modal = event.target.closest?.('dialog[open]');
    if (!modal) return;
    const controls = [...modal.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && event.target === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && event.target === last) { event.preventDefault(); first?.focus(); }
  };
  root.addEventListener('keydown', handleKeydown);
  return () => { unbindObjects(); root.removeEventListener('click', handleClick); root.removeEventListener('keydown', handleKeydown); };
}


// Content/actions/body/cell-renderers accept trusted application markup, all data text is escaped.
function objectId(id) { if (typeof id !== 'string' || !id || /\s/.test(id)) throw new TypeError('A unique ID without whitespace is required'); return escapeHtml(id); }
function objectAction(action) { return `data-control-action="${escapeHtml(action)}"`; }

export function textareaField({id,label,value='',name,rows=3,maxLength,required=false,disabled=false,hint='',error=''}) {
  objectId(id);
  return `<label class="field" for="${escapeHtml(id)}"><span>${escapeHtml(label)}</span><textarea id="${escapeHtml(id)}" rows="${Math.max(1,Number(rows)||3)}"${name?` name="${escapeHtml(name)}"`:''}${maxLength!==undefined?` maxlength="${escapeHtml(maxLength)}"`:''}${required?' required':''}${disabled?' disabled':''}${error?' aria-invalid="true"':''}${hint||error?` aria-describedby="${escapeHtml(id)}-help"`:''}>${escapeHtml(value)}</textarea>${hint||error?`<small id="${escapeHtml(id)}-help" class="${error?'field-error':''}"${error?' role="alert"':''}>${escapeHtml(error||hint)}</small>`:''}</label>`;
}

export function numberControl({id,label,value='',presets=[],action='number-change',...options}) {
  objectId(id);
  return `<div class="fui-number" ${objectAction(action)}>${field({id,label,value,type:'number',...options})}${presets.length?`<div class="toolbar fui-presets" role="group" aria-label="${escapeHtml(label)} – Schnellwerte">${presets.map(p=>`<button type="button" data-ui-preset="${escapeHtml(typeof p==='object'?p.value:p)}"${options.disabled?' disabled':''}>${escapeHtml(typeof p==='object'?p.label:p)}</button>`).join('')}</div>`:''}</div>`;
}

export function checkboxGroup({id,label,items,values=[],action='selection-change',disabled=false,days=false}) {
  objectId(id);const selected=new Set(values.map(String));
  return `<fieldset class="fui-check-group" id="${escapeHtml(id)}" data-ui-checks ${objectAction(action)}><legend>${escapeHtml(label)}</legend><div class="${days?'days':'fui-checks'}">${items.map((item,i)=>`<label class="${days?'':'check'}"${item.description?` title="${escapeHtml(item.description)}"`:''}><input type="checkbox" value="${escapeHtml(item.value??item.id)}" aria-label="${escapeHtml(item.description||item.label)}"${selected.has(String(item.value??item.id))?' checked':''}${disabled||item.disabled?' disabled':''}><span>${escapeHtml(item.label)}</span></label>`).join('')}</div></fieldset>`;
}

export function weekdayPicker({id,label='Wochentage',values=[],action='weekdays-change',disabled=false,labels=['Mo','Di','Mi','Do','Fr','Sa','So']}={}) {
  return checkboxGroup({id,label,values,action,disabled,days:true,items:labels.map((label,value)=>({value,label}))}).replace('data-ui-checks','data-ui-checks data-value-type="number"');
}

export function combobox({id,label,items,value='',selected='',action='combobox-select',placeholder='Suchen …',required=false,disabled=false,emptyLabel='Keine passenden Einträge gefunden.'}) {
  objectId(id);
  return `<div class="fui-combobox" id="${escapeHtml(id)}-control" data-ui-combobox data-selected="${escapeHtml(selected)}" ${objectAction(action)}>${field({id,label,value,placeholder,required,disabled,autocomplete:'off'}).replace('<input ',`<input role="combobox" aria-autocomplete="list" aria-controls="${escapeHtml(id)}-options" aria-expanded="false" `)}<button type="button" class="edit-button fui-combo-toggle" data-ui-combo-toggle aria-label="${escapeHtml(label)} aufklappen"${disabled?' disabled':''}>${icon('down')}</button><div class="fui-options" id="${escapeHtml(id)}-options" role="listbox" aria-label="${escapeHtml(label)}" hidden>${items.map((item,i)=>`<button type="button" class="fui-option" role="option" tabindex="-1" id="${escapeHtml(id)}-option-${i}" data-ui-option data-value="${escapeHtml(item.value??item.id)}" data-label="${escapeHtml(item.label)}" aria-selected="${String(String(item.value??item.id)===String(selected))}"${item.disabled?' disabled':''}><strong>${escapeHtml(item.label)}</strong>${item.description?`<small>${escapeHtml(item.description)}</small>`:''}</button>`).join('')}<div class="fui-options-empty" role="status" hidden>${escapeHtml(emptyLabel)}</div></div></div>`;
}

export function multiSelect({id,label='Auswahl',items,values=[],action='selection-change',search=true,all=true,selectedFirst=false,disabled=false,searchLabel='Name oder Entität suchen',allLabel='Alle sichtbaren auswählen',clearLabel='Auswahl aufheben',emptyLabel='Keine Treffer für diese Auswahl.'}) {
  objectId(id);const selected=new Set(values.map(String)),groups=[...new Set(items.map(i=>i.group||''))];
  return `<fieldset class="fui-multi" id="${escapeHtml(id)}" data-ui-multi ${objectAction(action)} data-selected-first="${selectedFirst}"><legend>${escapeHtml(label)}</legend>${search?field({id:id+'-search',label:searchLabel,type:'search',disabled}):''}${all?`<div class="toolbar import-toolbar"><button type="button" data-ui-select-all${disabled?' disabled':''}>${escapeHtml(allLabel)}</button><button type="button" data-ui-select-none${disabled?' disabled':''}>${escapeHtml(clearLabel)}</button></div>`:''}<div class="fui-selection-list">${groups.map(group=>`<section class="fui-selection-group" data-selection-group>${group?`<h4>${escapeHtml(group)}</h4>`:''}${items.filter(i=>(i.group||'')===group).sort((a,b)=>selectedFirst?Number(selected.has(String(b.value??b.id)))-Number(selected.has(String(a.value??a.id))):0).map(item=>`<label class="cover-option" data-selection-row data-search="${escapeHtml([item.label,item.description,item.value??item.id].filter(Boolean).join(' ').toLocaleLowerCase())}"><input type="checkbox" value="${escapeHtml(item.value??item.id)}"${selected.has(String(item.value??item.id))?' checked':''}${disabled||item.disabled?' disabled':''}><span><strong>${escapeHtml(item.label)}</strong>${item.description?`<small>${escapeHtml(item.description)}</small>`:''}${item.hint?`<small>${escapeHtml(item.hint)}</small>`:''}</span></label>`).join('')}</section>`).join('')}</div><p class="hint fui-selection-empty" role="status"${items.length?' hidden':''}>${escapeHtml(emptyLabel)}</p><small data-selection-count aria-live="polite">${items.filter(i=>selected.has(String(i.value??i.id))).length} ausgewählt</small></fieldset>`;
}

export function rangeControl({id,label,value=0,min=0,max=100,step=1,unit='%',action='range-change',keepLabel='Unverändert',allowKeep=true,disabled=false,reverse=false}) {
  objectId(id);if(!Number.isFinite(min)||!Number.isFinite(max)||max<=min||!Number.isFinite(step)||step<=0)throw new RangeError('Invalid range');
  const keep=value===null,n=keep?min:Math.max(min,Math.min(max,Number(value)));if(!Number.isFinite(n))throw new TypeError('Invalid range value');
  const position=reverse?max-n+min:n,percent=(position-min)/(max-min)*100;
  return `<div class="position-control" data-ui-range id="${escapeHtml(id)}-control" ${objectAction(action)} data-unit="${escapeHtml(unit)}" data-keep="${keep}" data-keep-label="${escapeHtml(keepLabel)}" data-reverse="${reverse}"><div class="slider-head"><label for="${escapeHtml(id)}">${escapeHtml(label)}</label><output for="${escapeHtml(id)}">${escapeHtml(keep?keepLabel:n+(unit?' '+unit:''))}</output></div><input id="${escapeHtml(id)}" type="range" min="${min}" max="${max}" step="${step}" value="${position}" aria-label="${escapeHtml(label)}" aria-valuetext="${escapeHtml(keep?keepLabel:n+(unit?' '+unit:''))}" style="--range-percent:${percent}%"${disabled?' disabled':''}>${allowKeep?`<div class="slider-foot"><button type="button" class="keep-value${keep?' selected':''}" data-ui-keep aria-pressed="${keep}"${disabled?' disabled':''}>${escapeHtml(keepLabel)}</button></div>`:''}</div>`;
}

export function whiteTemperatureControl({id,label='Weißtöne',value=4000,min=2000,max=6500,action='temperature-change',disabled=false,coldLabel='Kaltweiß',warmLabel='Warmweiß'}) {
  return `<div class="white-control"><div class="white-labels"><span>${escapeHtml(coldLabel)}</span><span>${escapeHtml(warmLabel)}</span></div>${rangeControl({id,label,value,min,max,step:1,unit:'K',action,allowKeep:false,disabled,reverse:true})}<div class="white-labels hint"><span>${max} K</span><span>${min} K</span></div></div>`;
}

export function parseColour(value) {
  if(Array.isArray(value)&&value.length===3&&value.every(n=>Number.isFinite(n)&&n>=0&&n<=255))return value.map(Math.round);
  if(typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value))return [1,3,5].map(i=>parseInt(value.slice(i,i+2),16));
  throw new TypeError('Colour requires #RRGGBB or three RGB numbers');
}
export function rgbToHSV(rgb) { const [r,g,b]=parseColour(rgb).map(n=>n/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d)h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;return {h:(h*60+360)%360,s:max?d/max:0,v:max}; }
export function hsvToRGB(h,s,v=1) { if(![h,s,v].every(Number.isFinite)||s<0||s>1||v<0||v>1)throw new RangeError('Invalid HSV colour');h=((h%360)+360)%360;const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;return (h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x]).map(n=>Math.round((n+m)*255)); }
export function colourPicker({id,label='Farbe',value='#FF7000',action='colour-change',disabled=false}) {
  objectId(id);const rgb=parseColour(value),{h,s}=rgbToHSV(rgb),a=h*Math.PI/180,hex='#'+rgb.map(n=>n.toString(16).padStart(2,'0')).join('');
  return `<div class="colour-control" id="${escapeHtml(id)}" data-ui-colour ${objectAction(action)} data-rgb="${rgb.join(',')}"><span class="field-label">${escapeHtml(label)}</span><div class="colour-wheel" tabindex="${disabled?-1:0}" role="group" aria-label="${escapeHtml(label)}: Pfeiltasten zum Wählen, Pos1 für Weiß" aria-disabled="${disabled}" aria-describedby="${escapeHtml(id)}-value"><span class="colour-marker" style="left:${50+Math.sin(a)*s*50}%;top:${50-Math.cos(a)*s*50}%;background:${hex}"></span></div><div class="colour-preview"><span data-colour-swatch style="background:${hex}"></span><output id="${escapeHtml(id)}-value" aria-live="polite">${hex.toUpperCase()}</output></div></div>`;
}

export function timeWindow({id,label='Zeitfenster',start='00:00',end='00:00',action='time-window-change',disabled=false,startLabel='Von',endLabel='Bis'}) {
  objectId(id);return `<fieldset class="fui-time-window" id="${escapeHtml(id)}" data-ui-time-window ${objectAction(action)}><legend>${escapeHtml(label)}</legend><div class="grid">${field({id:id+'-start',name:'start',label:startLabel,value:start,type:'time',required:true,disabled})}${field({id:id+'-end',name:'end',label:endLabel,value:end,type:'time',required:true,disabled})}</div><small>Gleiche Uhrzeit = ganztägig. Zeitfenster über Mitternacht sind möglich.</small></fieldset>`;
}
export function parseMonthDay(value) {
  const m=String(value).match(/^(\d{1,2})\.(\d{1,2})\.?$/);if(!m)return null;
  const day=Number(m[1]),month=Number(m[2]),date=new Date(Date.UTC(2000,month-1,day));
  return date.getUTCMonth()===month-1&&date.getUTCDate()===day?`${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`:null;
}
export function seasonPicker({id,label='Gültigkeitszeitraum',enabled=false,start='04-01',end='10-31',action='season-change',disabled=false}) {
  objectId(id);const display=s=>/^\d{2}-\d{2}$/.test(s)?s.slice(3)+'.'+s.slice(0,2):s;
  return `<fieldset class="season-box" id="${escapeHtml(id)}" data-ui-season ${objectAction(action)}><legend>${escapeHtml(label)}</legend><label class="check"><input type="checkbox" data-season-enabled${enabled?' checked':''}${disabled?' disabled':''}>Saison einschränken</label><div class="season-dates"${enabled?'':' hidden'}>${field({id:id+'-start',name:'start',label:'Von (TT.MM.)',value:display(start),placeholder:'01.04.',maxLength:6,inputMode:'numeric',disabled:disabled||!enabled})}${field({id:id+'-end',name:'end',label:'Bis (TT.MM.)',value:display(end),placeholder:'31.10.',maxLength:6,inputMode:'numeric',disabled:disabled||!enabled})}</div><small>Der Zeitraum darf über den Jahreswechsel reichen.</small></fieldset>`;
}

export function dateRange({id,label='Zeitraum',start='',end='',action='date-range-change',disabled=false,optionalEnd=true}) {
  objectId(id);return `<fieldset id="${escapeHtml(id)}" data-ui-date-range ${objectAction(action)}><legend>${escapeHtml(label)}</legend><div class="grid">${field({id:id+'-start',name:'start',label:'Von',value:start,type:'date',required:true,disabled})}${field({id:id+'-end',name:'end',label:optionalEnd?'Bis (optional)':'Bis',value:end,type:'date',min:start||undefined,required:!optionalEnd,disabled})}</div></fieldset>`;
}

export function recurrenceEditor({id,label='Wiederholung',value={},action='recurrence-change',disabled=false,people=[]}) {
  objectId(id);const kind=value.kind||'once',unit=kind==='daily'?'day':kind==='yearly'?'year':kind.startsWith('monthly')?'month':'week',start=value.start||'',days=value.weekdays||[],repeating=kind!=='once';
  return `<fieldset class="recurrence"${disabled?' disabled':''} id="${escapeHtml(id)}" data-ui-recurrence ${objectAction(action)}><legend>${escapeHtml(label)}</legend>${dateRange({id:id+'-dates',start,end:value.end||'',disabled})}<label class="check"><input type="checkbox" name="repeating"${repeating?' checked':''}${disabled?' disabled':''}>${icon('schedule')}Wiederkehrend</label><div class="recurrence-controls"${repeating?'':' hidden'}><div class="repeat-line"><span>Wiederholen alle</span><input type="number" name="interval" min="1" max="365" value="${escapeHtml(value.interval??1)}" aria-label="Wiederholungsabstand"${disabled||!repeating?' disabled':''}><select name="unit" aria-label="Wiederholungseinheit"${disabled||!repeating?' disabled':''}>${[['day','Tag'],['week','Woche'],['month','Monat'],['year','Jahr']].map(([v,l])=>`<option value="${v}"${unit===v?' selected':''}>${l}</option>`).join('')}</select></div><label class="field" data-month-mode><span>Monatliches Muster</span><select name="month_mode"${disabled?' disabled':''}><option value="date"${kind!=='monthly_nth'?' selected':''}>Am Tag des Startdatums</option><option value="nth"${kind==='monthly_nth'?' selected':''}>An einem bestimmten Wochentag</option></select></label><label class="field" data-nth><span>Welcher im Monat?</span><select name="nth"${disabled?' disabled':''}>${[[1,'Erster'],[2,'Zweiter'],[3,'Dritter'],[4,'Vierter'],[5,'Fünfter'],[-1,'Letzter']].map(([v,l])=>`<option value="${v}"${Number(value.nth??1)===v?' selected':''}>${l}</option>`).join('')}</select></label>${weekdayPicker({id:id+'-days',values:days,disabled})}${people.length?`<label class="check"><input type="checkbox" name="alternating"${value.alternating?' checked':''}${disabled?' disabled':''}>Abwechselnd</label><label class="field" data-first-person><span>Wer beginnt?</span><select name="first_person"${disabled?' disabled':''}>${people.map(p=>`<option value="${escapeHtml(p)}"${value.first_person===p?' selected':''}>${escapeHtml(p)}</option>`).join('')}</select></label>`:''}<small class="recurrence-hint" aria-live="polite"></small></div></fieldset>`;
}

export function programGroup({id,title,count,content='',expanded=true}) {
  objectId(id);return `<section class="program-group" id="${escapeHtml(id)}"><button type="button" class="program-group-head" data-ui="collapse" aria-expanded="${expanded}" aria-controls="${escapeHtml(id)}-content">${icon('chevron',{expanded})}<strong>${escapeHtml(title)}</strong><span>${escapeHtml(count??'')}</span></button><div id="${escapeHtml(id)}-content"${expanded?'':' hidden'}>${content}</div></section>`;
}
export function programRow({id,title,meta=[],enabled=true,expanded=false,content='',actions='',index=0,count=1,editable=true,sortable=true,copyable=true,disabled=false}) {
  objectId(id);const data={program:id};
  const tools=(editable&&sortable?programOrderButtons({programId:id,index,count,disabled}):'')+toggle({label:title+' aktiv',action:'program-enabled',checked:enabled,disabled,data,iconOnly:true})+(editable&&copyable?iconButton({icon:'copy',label:'Programm kopieren',action:'copy-program',data,disabled,desktopOnly:true}):'')+(editable?iconButton({icon:'edit',label:'Programm bearbeiten',action:'edit-program',data,disabled}):'')+actions;
  return `<section class="program${enabled?'':' muted'}"><div class="program-head"><div class="program-heading"><button type="button" class="program-title" data-ui="collapse" aria-expanded="${expanded}" aria-controls="${escapeHtml(id)}-content">${icon('chevron',{expanded})}<span>${escapeHtml(title)}</span></button><div class="tags">${meta.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div></div><div class="toolbar">${tools}</div></div><div id="${escapeHtml(id)}-content"${expanded?'':' hidden'}>${content}</div></section>`;
}
export function actionRow({title,description='',detail='',actions='',enabled=true,inlineActions=false,skipped=false}) {
  return `<div class="ride${enabled?'':' muted'}${skipped?' skipped':''}"><div class="ride-info"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span>${detail?`<small>${escapeHtml(detail)}</small>`:''}</div><div class="toolbar ride-actions${inlineActions?' inline-actions':''}">${actions}</div></div>`;
}
export function actionEditor({id,title,summary='',content='',actions='',expanded=true}) {
  objectId(id);return `<section class="subpanel"><div class="ride-editor-head"><button type="button" class="ride-fold" data-ui="collapse" aria-controls="${escapeHtml(id)}-body" aria-expanded="${expanded}">${icon('chevron',{expanded})}<span class="ride-fold-text"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(summary)}</span></span></button><div class="toolbar ride-editor-actions">${actions}</div></div><div id="${escapeHtml(id)}-body" class="ride-editor-body"${expanded?'':' hidden'}>${content}</div></section>`;
}
export function foldControls({scopeId,expandLabel='Alle aufklappen',collapseLabel='Alle zuklappen'}) {
  objectId(scopeId);return `<div class="toolbar"><button type="button" data-ui-fold-all="true" data-scope="${escapeHtml(scopeId)}">${escapeHtml(expandLabel)}</button><button type="button" data-ui-fold-all="false" data-scope="${escapeHtml(scopeId)}">${escapeHtml(collapseLabel)}</button></div>`;
}
export function sensorOverview({id,title='Messwerte',expanded=true,sunrise='',sunset='',groups=[]}) {
  objectId(id);return `<div class="overview-panel"><button type="button" class="overview-toggle" data-ui="collapse" aria-controls="${escapeHtml(id)}-content" aria-expanded="${expanded}">${icon('chevron',{expanded})}<span>${escapeHtml(title)}</span></button><section class="overview" id="${escapeHtml(id)}-content"${expanded?'':' hidden'}>${sunrise||sunset?`<div class="sun-row">${[['sunrise',sunrise,'Sonnenaufgang'],['sunset',sunset,'Sonnenuntergang']].filter(([,v])=>v).map(([name,value,label])=>`<span class="sun-value" title="${label}" aria-label="${label} ${escapeHtml(value)}">${icon(name)}<span>${escapeHtml(value)}</span></span>`).join('')}</div>`:''}${groups.map(group=>`<section class="overview-group"><h4>${escapeHtml(group.title)}</h4><div class="sensor-grid">${group.items.map(item=>`<div class="sensor-value"><span class="sensor-label">${escapeHtml(item.label)}</span><span class="sensor-state" title="${escapeHtml(item.value)}">${icon(item.icon||'unknown')}<span${item.icon==='lock'||item.icon==='unlock'?' class="visually-hidden"':''}>${escapeHtml(item.value)}</span></span></div>`).join('')}</div></section>`).join('')}</section></div>`;
}
export function statusBadge({label,state='neutral',icon:iconName}) {
  if(!['neutral','active','success','warning','error','paused'].includes(state))throw new TypeError('Unknown status state');
  return `<span class="fui-status-tag ${state}">${iconName?icon(iconName):''}${escapeHtml(label)}</span>`;
}
export function counter(value,label='') { return `<small class="fui-counter"${label?` aria-label="${escapeHtml(label)}"`:''}>${escapeHtml(value)}</small>`; }
/** Static account summary. Values, units, status and permissions belong to the host. */
export function accountTile({id,label,value,unit='',status='',state='neutral',description='',details=''}) {
  objectId(id);
  if(!['neutral','active','success','warning','error'].includes(state))throw new TypeError('Unknown account state');
  return `<article class="fui-account-tile ${state}" id="${escapeHtml(id)}" aria-labelledby="${escapeHtml(id)}-label"${details?` aria-describedby="${escapeHtml(id)}-details" title="${escapeHtml(details)}"`:''}><h4 class="fui-account-label" id="${escapeHtml(id)}-label" title="${escapeHtml(label)}">${escapeHtml(label)}</h4><div class="fui-account-balance"><strong class="fui-account-value">${escapeHtml(value)}</strong><span class="fui-account-unit">${escapeHtml([unit,status].filter(Boolean).join(' '))}</span></div>${description?`<p class="fui-account-description" title="${escapeHtml(description)}">${escapeHtml(description)}</p>`:''}${details?`<span class="visually-hidden" id="${escapeHtml(id)}-details">${escapeHtml(details)}</span>`:''}</article>`;
}
/** Always two equal columns, including mobile and single-account views. */
export function accountTiles({content,label='Zeitkonten'}) {
  return `<div class="fui-account-tiles" role="group" aria-label="${escapeHtml(label)}">${content}</div>`;
}
export function historyList({entries,emptyLabel='Noch keine Einträge vorhanden.'}) {
  if(!entries.length)return emptyState(emptyLabel);
  return `<div class="daily-history" role="list">${entries.map(entry=>{
    const failed=entry.status==='error',pending=entry.status==='pending',result=entry.result||(failed?'Fehlgeschlagen':pending?'Wartet':'Erfolgreich');
    return `<div class="daily-history-row ${failed?'failed':pending?'pending':'completed'}" role="listitem"><time${entry.datetime?` datetime="${escapeHtml(entry.datetime)}"`:''}>${escapeHtml(entry.time)}</time><div class="daily-command"><strong>${escapeHtml(entry.title)}</strong><small>${escapeHtml(entry.description)}</small>${entry.detail?`<small class="failure-reason">${escapeHtml(entry.detail)}</small>`:''}</div><span class="command-result">${icon(failed?'failure':pending?'schedule':'success')}${escapeHtml(result)}</span></div>`;
  }).join('')}</div>`;
}
export function groupedHistory({id,title='Verlauf',groups,expanded=false}) {
  objectId(id);return section({id,title,expanded,trailing:counter(groups.reduce((n,g)=>n+g.entries.length,0),'Einträge'),content:groups.map((g,i)=>`<div class="fui-history-month">${section({id:id+'-group-'+i,title:g.title,expanded:g.expanded??false,trailing:counter(g.entries.length),content:historyList({entries:g.entries})})}</div>`).join('')||emptyState('Noch keine Einträge vorhanden.')});
}
export function statisticsTable({label='Statistik',columns,rows,totals}) {
  if(!columns.length)throw new TypeError('Statistics needs columns');
  const cells=(values,tag)=>columns.map((col,i)=>`<${tag}${tag==='th'?' scope="col"':''}${col.align==='right'?' class="numeric"':''}>${escapeHtml(values[i])}</${tag}>`).join('');
  return `<div class="fui-statistics"><table aria-label="${escapeHtml(label)}"><thead><tr>${cells(columns.map(c=>c.label),'th')}</tr></thead><tbody>${rows.map(values=>`<tr>${cells(values,'td')}</tr>`).join('')}</tbody>${totals?`<tfoot><tr>${cells(totals,'td')}</tr></tfoot>`:''}</table></div>`;
}
export function dateNavigation({label,previousLabel='Vorherige Woche',nextLabel='Nächste Woche',todayLabel='Heute',previousAction='previous-period',nextAction='next-period',todayAction='today',disabled=false}) {
  return `<div class="week">${iconButton({icon:'left',label:previousLabel,action:previousAction,disabled})}<strong>${escapeHtml(label)}</strong>${button({label:todayLabel,action:todayAction,disabled})}${iconButton({icon:'right',label:nextLabel,action:nextAction,disabled})}</div>`;
}
export function dateKey(date) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function calendarDates(start,count=7) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!Number.isInteger(count)||count<1||count>366)throw new TypeError('Invalid calendar range');
  const first=new Date(start+'T12:00:00');if(!Number.isFinite(first.getTime())||dateKey(first)!==start)throw new TypeError('Invalid calendar date');
  return Array.from({length:count},(_,i)=>{const day=new Date(first);day.setDate(day.getDate()+i);return dateKey(day);});
}
function safeLink(value) {try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?escapeHtml(u.href):'';}catch{return '';}}
export function weekCalendar({id,start,entries=[],locale='de-DE',today='',emptyLabel='Eintrag hinzufügen',action='open-day'}) {
  objectId(id);return `<div id="${escapeHtml(id)}" class="days fui-calendar">${calendarDates(start).map(date=>{const entry=entries.find(e=>e.date===date),day=new Date(date+'T12:00:00'),link=entry?.link&&safeLink(entry.link);return `<article class="calendar-row${entry?'':' empty'}${date===today?' today':''}" data-ui-calendar-day="${date}" ${objectAction(action)}><div class="day-date"><b>${escapeHtml(day.toLocaleDateString(locale,{weekday:'short'}))}</b><small>${escapeHtml(day.toLocaleDateString(locale,{day:'2-digit',month:'2-digit'}))}</small></div><div class="calendar-content"><div class="setting-row"><div class="row-text"><strong>${escapeHtml(entry?.title||emptyLabel)}</strong>${entry?.description?`<small>${escapeHtml(entry.description)}</small>`:''}</div><div class="toolbar">${entry?.actions||iconButton({icon:entry?'edit':'add',label:entry?'Eintrag bearbeiten':emptyLabel,action,data:{date}})}</div></div>${link?`<a class="meal-link" href="${link}" target="_blank" rel="noopener">Link öffnen</a>`:''}</div></article>`;}).join('')}</div>`;
}
export function completionRow({id,title,description='',people=[],action='completion-change',readOnly=false}) {
  objectId(id);const completed=people.length&&people.every(p=>p.completed);
  return `<div class="setting-row${completed?' completed':''}"><div class="row-text"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small></div><div class="checks">${people.map(p=>readOnly?`<span class="assignee${p.completed?' completed':''}">${escapeHtml(p.label)}${p.completed?icon('success'):''}</span>`:`<label class="complete" ${objectAction(action)} data-ui-completion data-id="${escapeHtml(id)}" data-person="${escapeHtml(p.id)}"><input type="checkbox" aria-label="${escapeHtml(title+' – '+p.label)}"${p.completed?' checked':''}${p.disabled?' disabled':''}><span class="visually-hidden">${escapeHtml(p.label)}</span></label>`).join('')}</div></div>`;
}
export function dayAgenda({id,days}) {objectId(id);return days.map((day,i)=>section({id:id+'-'+i,title:day.title,expanded:day.expanded??true,trailing:counter(day.count??'',day.countLabel||''),content:day.content||''})).join('');}
export function languagePicker({value='de',action='language-change',languages=[{id:'de',label:'Deutsch',short:'DE',flag:'🇩🇪'},{id:'en',label:'English',short:'EN',flag:'🇬🇧'}] }={}) {
  return `<div class="language-picker" role="group" aria-label="Sprache">${languages.map(l=>`<button type="button" data-action="${escapeHtml(action)}" data-language="${escapeHtml(l.id)}" aria-pressed="${l.id===value}" title="${escapeHtml(l.label)}">${escapeHtml(l.flag||'')} <span>${escapeHtml(l.short||l.id)}</span></button>`).join('')}</div>`;
}
export function backupControls({id='backup',exportAction='export-backup',importAction='import-backup',exportLabel='Sicherung erstellen',importLabel='Sicherung wiederherstellen',disabled=false,maxBytes=2*1024*1024}={}) {
  objectId(id);return `<div id="${escapeHtml(id)}" data-ui-backup ${objectAction(importAction)} data-max-bytes="${Number(maxBytes)}"><div class="toolbar backup-actions">${button({label:exportLabel,action:exportAction,disabled})}<button type="button" data-ui-import${disabled?' disabled':''}>${escapeHtml(importLabel)}</button></div><input type="file" accept="application/json,.json" aria-label="Sicherungsdatei" hidden${disabled?' disabled':''}><div data-backup-feedback></div></div>`;
}
export function helpContent({title='',content=''}) {return `<article class="howto">${title?`<h2>${escapeHtml(title)}</h2>`:''}${content}</article>`;}
export function panelHeader({title,dirty=false,busy=false,menu=true,reload=true,save=true,menuAction='menu',reloadAction='reload',saveAction='save',saveLabel='Änderungen speichern',savedLabel='Gespeichert'}) {
  return `<header class="fui-panel-header">${menu?iconButton({icon:'menu',label:'Menü öffnen',action:menuAction}):''}<strong>${escapeHtml(title)}</strong><span class="grow"></span>${reload?button({label:'Neu laden',action:reloadAction,disabled:busy}):''}${save?busyButton({label:dirty?saveLabel:savedLabel,busy,disabled:!dirty,action:saveAction}):''}</header>`;
}
export function feedback(message,{kind='info'}={}) {
  if(!['info','success','warning','error'].includes(kind))throw new TypeError('Unknown feedback kind');
  return `<div class="fui-feedback ${kind}" role="${kind==='error'?'alert':'status'}">${escapeHtml(message)}</div>`;
}
export function formError(message) {return `<p class="modal-save-error" role="alert"${message?'':' hidden'}>${escapeHtml(message)}</p>`;}
export function emptyState(message,{actionContent=''}={}) {return `<div class="empty" role="status">${escapeHtml(message)}${actionContent?`<div class="toolbar">${actionContent}</div>`:''}</div>`;}
export function loadingState(label='Wird geladen …') {return `<p class="hint fui-loading" role="status" aria-live="polite" aria-busy="true">${escapeHtml(label)}</p>`;}
export function busyButton({label='Speichern',busy=false,busyLabel='Speichern …',disabled=false,action='save',variant='primary',data={}}={}) {return button({label:busy?busyLabel:label,disabled:disabled||busy,action,variant,data}).replace('<button ',`<button aria-busy="${busy}" `);}
export function confirmDialog({id,title='Eintrag löschen?',message,confirmLabel='Löschen',cancelLabel='Abbrechen',confirmAction='confirm',cancelAction='cancel',danger=true}) {
  return dialog({id,title,content:`<p>${escapeHtml(message)}</p>`,actions:button({label:cancelLabel,action:cancelAction}).replace('data-action=', 'data-ui-cancel-action=')+button({label:confirmLabel,action:confirmAction,variant:danger?'danger':'primary'})});
}
export function photoPreview({src,alt='Foto',large=false}) {
  if(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(src||''))throw new TypeError('A JPEG/PNG/WebP data URL is required');
  return `<img class="${large?'gm-photo-large':'photo-preview'}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
}
export function photoPicker({id,label='Foto (optional)',src='',action='photo-change',disabled=false}) {
  objectId(id);return `<div class="gm-photo-box" id="${escapeHtml(id)}" data-ui-photo ${objectAction(action)}><span class="field-label">${escapeHtml(label)}</span><div class="toolbar"><button type="button" data-ui-photo-choose${disabled?' disabled':''}>Foto wählen</button><button type="button" data-ui-photo-remove${src?'':' hidden'}${disabled?' disabled':''}>Foto entfernen</button></div><input type="file" accept="image/jpeg,image/png,image/webp" hidden aria-label="${escapeHtml(label)}"${disabled?' disabled':''}><div data-photo-preview>${src?photoPreview({src}):''}</div><small data-photo-status role="status">${src?'Foto vorhanden.':'JPG / PNG / WebP · bis 20 MB · wird automatisch verkleinert.'}</small><div data-photo-error></div></div>`;
}
export function photoDialog({id,title='Foto',src,alt}) {return dialog({id,title,content:photoPreview({src,alt,large:true})});}


export function recurrenceSummary(rule) {
  if(rule.kind==='once')return 'Einmalig';
  const n=rule.interval||1,days=['Mo','Di','Mi','Do','Fr','Sa','So'];
  if(rule.kind==='daily')return n===1?'Täglich':`Alle ${n} Tage`;
  if(rule.kind==='weekly')return (n===1?'Jede Woche':`Alle ${n} Wochen`)+' · '+(rule.weekdays||[]).map(i=>days[i]).join(', ');
  if(rule.kind==='yearly')return (n===1?'Jährlich':`Alle ${n} Jahre`)+' · '+(rule.start||'').slice(5);
  const prefix=n===1?'Monatlich':`Alle ${n} Monate`;
  return rule.kind==='monthly_date'?prefix+' · am '+Number((rule.start||'').slice(8))+'. Tag':prefix+' · '+(rule.nth===-1?'Letzter':rule.nth+'.')+' '+(rule.weekdays||[]).map(i=>days[i]).join(', ');
}

export async function readJSONFile(file,{maxBytes=2*1024*1024}={}) {
  if(!file||typeof file.text!=='function')throw new TypeError('Bitte eine Sicherungsdatei auswählen.');
  if(file.size>maxBytes)throw new Error('Datei zu groß.');
  try{return JSON.parse(await file.text());}catch{throw new Error('Die Datei enthält kein gültiges JSON.');}
}
export function downloadJSON(value,{filename='sicherung.json',document:doc=globalThis.document}={}) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=doc.createElement('a');
  a.href=url;a.download=filename;doc.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
}
export async function compressPhoto(file) {
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Bitte ein JPG-, PNG- oder WebP-Foto wählen.');
  if(file.size>20*1024*1024)throw new Error('Bitte ein Foto bis 20 MB wählen.');
  const url=URL.createObjectURL(file);
  try{
    const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Das Foto konnte nicht gelesen werden.'));img.src=url;});
    if(!img.naturalWidth||!img.naturalHeight)throw new Error('Das Foto hat keine gültige Größe.');
    const factor=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(img.naturalWidth*factor));canvas.height=Math.max(1,Math.round(img.naturalHeight*factor));
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Bildverarbeitung nicht verfügbar.');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    for(const quality of [.85,.7,.55,.4]){const data=canvas.toDataURL('image/jpeg',quality);if(data.length<950000)return data;}
    throw new Error('Das Foto ist zu groß. Bitte ein kleineres Bild wählen.');
  }finally{URL.revokeObjectURL(url);}
}

/** UI event delegation only: no network, HA services, persistence or business decisions. */
export function bindObjects(root,onAction) {
  let disposed=false;const initialized=new WeakSet(),photoTokens=new WeakMap();
  const emit=(control,event,value,extra={})=>{if(!disposed&&control.dataset.controlAction)onAction({action:control.dataset.controlAction,data:{...control.dataset},value,element:control,originalEvent:event,...extra});};
  const closeCombo=box=>{box.querySelector('[role=listbox]').hidden=true;const input=box.querySelector('input');input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');box.querySelectorAll('.active').forEach(el=>el.classList.remove('active'));};
  const options=box=>[...box.querySelectorAll('[data-ui-option]')].filter(el=>!el.hidden&&!el.disabled);
  const filterCombo=box=>{
    const input=box.querySelector('input'),q=input.value.trim().toLocaleLowerCase();
    box.querySelectorAll('[data-ui-option]').forEach(el=>{el.hidden=!el.textContent.toLocaleLowerCase().includes(q);el.classList.remove('active');});
    box.querySelector('.fui-options-empty').hidden=Boolean(options(box).length);
    input.removeAttribute('aria-activedescendant');
  };
  const openCombo=box=>{if(box.querySelector('input').disabled)return;filterCombo(box);box.querySelector('[role=listbox]').hidden=false;box.querySelector('input').setAttribute('aria-expanded','true');};
  const choose=(box,option,event)=>{
    if(option.disabled)return;const input=box.querySelector('input');input.value=option.dataset.label;box.dataset.selected=option.dataset.value;
    box.querySelectorAll('[data-ui-option]').forEach(el=>el.setAttribute('aria-selected',String(el===option)));
    input.focus();closeCombo(box);emit(box,event,option.dataset.value,{label:option.dataset.label});
  };
  const updateMulti=control=>{
    const q=(control.querySelector('input[type=search]')?.value||'').trim().toLocaleLowerCase();
    for(const group of control.querySelectorAll('[data-selection-group]')){
      let rows=[...group.querySelectorAll('[data-selection-row]')];
      rows.forEach(el=>el.hidden=!el.dataset.search.includes(q));
      if(control.dataset.selectedFirst==='true'){rows.sort((a,b)=>Number(b.querySelector('input').checked)-Number(a.querySelector('input').checked));rows.forEach(el=>group.append(el));}
      group.hidden=rows.every(el=>el.hidden);
    }
    control.querySelector('.fui-selection-empty').hidden=Boolean(control.querySelector('[data-selection-row]:not([hidden])'));
    control.querySelector('[data-selection-count]').textContent=control.querySelectorAll('input[type=checkbox]:checked').length+' ausgewählt';
  };
  const selection=control=>[...control.querySelectorAll('input[type=checkbox]:checked')].map(el=>control.dataset.valueType==='number'?Number(el.value):el.value);
  const updateRange=control=>{
    const input=control.querySelector('input'),keep=control.dataset.keep==='true',n=control.dataset.reverse==='true'?Number(input.max)+Number(input.min)-Number(input.value):Number(input.value),text=keep?control.dataset.keepLabel:n+(control.dataset.unit?' '+control.dataset.unit:'');
    control.querySelector('output').textContent=text;input.setAttribute('aria-valuetext',text);input.style.setProperty('--range-percent',((input.value-input.min)/(input.max-input.min)*100)+'%');
    const button=control.querySelector('[data-ui-keep]');button?.classList.toggle('selected',keep);button?.setAttribute('aria-pressed',String(keep));return keep?null:n;
  };
  const updateRecurrence=control=>{
    const get=name=>control.querySelector(`[name="${name}"]`),repeating=get('repeating'),alternate=get('alternating'),globalDisabled=control.hasAttribute('disabled');
    if(alternate?.checked)repeating.checked=true;
    const unit=get('unit').value,kind=!repeating.checked?'once':unit==='day'?'daily':unit==='year'?'yearly':unit==='month'?(get('month_mode').value==='nth'?'monthly_nth':'monthly_date'):'weekly';
    const start=get('start').value,end=get('end');end.min=start;end.closest('label').hidden=!repeating.checked;end.disabled=globalDisabled||!repeating.checked;
    control.querySelector('.recurrence-controls').hidden=!repeating.checked;
    control.querySelector('[data-month-mode]').hidden=unit!=='month';control.querySelector('[data-nth]').hidden=kind!=='monthly_nth';
    const days=control.querySelector('[data-ui-checks]');days.hidden=!['weekly','monthly_nth'].includes(kind);
    const first=control.querySelector('[data-first-person]');if(first)first.hidden=!alternate?.checked;
    control.querySelectorAll('.recurrence-controls input,.recurrence-controls select').forEach(el=>{el.disabled=globalDisabled||!repeating.checked||Boolean(el.closest('[hidden]'));});
    const rule={kind,interval:kind==='once'?1:Number(get('interval').value),start,end:kind==='once'?'':end.value,weekdays:[...days.querySelectorAll('input:checked')].map(el=>Number(el.value)),nth:Number(get('nth').value),alternating:Boolean(alternate?.checked),first_person:get('first_person')?.value||''};
    const dayRequired=['weekly','monthly_nth'].includes(kind);const dayInput=days.querySelector('input');dayInput?.setCustomValidity(dayRequired&&!rule.weekdays.length?'Bitte mindestens einen Wochentag auswählen.':'');
    const valid=Boolean(start)&&Number.isInteger(rule.interval)&&rule.interval>=1&&rule.interval<=365&&(!rule.end||rule.end>=start)&&(!dayRequired||rule.weekdays.length>0);
    let text=valid?recurrenceSummary(rule):'Bitte Datum, Wiederholungsabstand und Wochentage prüfen.';
    if(rule.alternating)text+=' · Abwechselnd, Beginn: '+rule.first_person;
    if(kind==='monthly_date'&&Number(start.slice(8))>28)text+=' · Monate ohne diesen Tag werden übersprungen.';
    if(kind==='yearly'&&start.slice(5)==='02-29')text+=' · Jahre ohne den 29. Februar werden übersprungen.';
    control.querySelector('.recurrence-hint').textContent=text;return {rule,valid};
  };
  const init=()=>{
    for(const el of root.querySelectorAll('[data-ui-multi],[data-ui-recurrence],[data-ui-range]')){
      if(initialized.has(el))continue;initialized.add(el);
      if(el.hasAttribute('data-ui-multi'))updateMulti(el);
      if(el.hasAttribute('data-ui-recurrence'))updateRecurrence(el);
      if(el.hasAttribute('data-ui-range'))updateRange(el);
    }
  };
  const click=event=>{
    const target=event.target.closest?.('button'),combo=event.target.closest?.('[data-ui-combobox]');
    if(target?.disabled)return;
    if(target?.hasAttribute('data-ui-combo-toggle')){const open=combo.querySelector('input').getAttribute('aria-expanded')==='true';combo.querySelector('input').focus();if(open)closeCombo(combo);else openCombo(combo);return;}
    if(target?.hasAttribute('data-ui-option')){choose(combo,target,event);return;}
    if(target?.hasAttribute('data-ui-preset')){const box=target.closest('.fui-number'),input=box.querySelector('input');input.value=target.dataset.uiPreset;input.focus();emit(box,event,input.valueAsNumber,{valid:input.checkValidity()});return;}
    if(target?.hasAttribute('data-ui-keep')){const control=target.closest('[data-ui-range]');control.dataset.keep='true';updateRange(control);emit(control,event,null);return;}
    if(target?.hasAttribute('data-ui-select-all')||target?.hasAttribute('data-ui-select-none')){
      const control=target.closest('[data-ui-multi]'),checked=target.hasAttribute('data-ui-select-all');
      control.querySelectorAll('input[type=checkbox]').forEach(el=>{if(!el.disabled&&(!checked||!el.closest('[data-selection-row]').hidden))el.checked=checked;});updateMulti(control);emit(control,event,selection(control));return;
    }
    if(target?.hasAttribute('data-ui-fold-all')){
      const scope=root.getElementById(target.dataset.scope);scope?.querySelectorAll('[data-ui="collapse"]').forEach(el=>{const expanded=target.dataset.uiFoldAll==='true';el.setAttribute('aria-expanded',String(expanded));el.querySelector('.chevron')?.classList.toggle('expanded',expanded);const body=root.getElementById(el.getAttribute('aria-controls'));if(body)body.hidden=!expanded;});return;
    }
    if(target?.hasAttribute('data-ui-cancel-action')){target.closest('dialog')?.close();onAction({action:target.dataset.uiCancelAction,data:{},value:false,element:target,originalEvent:event});return;}
    if(target?.hasAttribute('data-ui-import')){target.closest('[data-ui-backup]').querySelector('input[type=file]').click();return;}
    if(target?.hasAttribute('data-ui-photo-choose')){target.closest('[data-ui-photo]').querySelector('input[type=file]').click();return;}
    if(target?.hasAttribute('data-ui-photo-remove')){const control=target.closest('[data-ui-photo]');photoTokens.set(control,{});control.querySelector('[data-photo-preview]').replaceChildren();control.querySelector('[data-photo-status]').textContent='Foto wird entfernt.';control.querySelector('[data-photo-error]').replaceChildren();target.hidden=true;control.querySelector('input').value='';emit(control,event,null);return;}
    const day=event.target.closest?.('[data-ui-calendar-day]');
    if(day&&!event.target.closest('button,a,input,select,textarea'))emit(day,event,day.dataset.uiCalendarDay,{date:day.dataset.uiCalendarDay});
  };
  const input=event=>{
    const el=event.target,recurrence=el.closest?.('[data-ui-recurrence]');
    if(recurrence){if(el.name==='repeating'&&!el.checked){const alternate=recurrence.querySelector('[name=alternating]');if(alternate)alternate.checked=false;}const {rule,valid}=updateRecurrence(recurrence);emit(recurrence,event,rule,{valid});return;}
    const combo=el.closest?.('[data-ui-combobox]');if(combo&&el.matches('input')){combo.dataset.selected='';combo.querySelectorAll('[data-ui-option]').forEach(o=>o.setAttribute('aria-selected','false'));openCombo(combo);return;}
    const multi=el.closest?.('[data-ui-multi]');if(multi&&el.type==='search'){updateMulti(multi);return;}
    const range=el.closest?.('[data-ui-range]');if(range){range.dataset.keep='false';emit(range,event,updateRange(range),{phase:'input'});return;}
    const number=el.closest?.('.fui-number');if(number)emit(number,event,el.valueAsNumber,{valid:el.checkValidity()});
    const season=el.closest?.('[data-ui-season]');if(season&&el.type!=='checkbox'){el.setCustomValidity(parseMonthDay(el.value)?'':'Bitte ein gültiges Datum als TT.MM. eingeben.');}
  };
  const change=async event=>{
    const el=event.target,recurrence=el.closest?.('[data-ui-recurrence]');
    if(recurrence){if(el.name==='repeating'&&!el.checked){const alternate=recurrence.querySelector('[name=alternating]');if(alternate)alternate.checked=false;}const {rule,valid}=updateRecurrence(recurrence);emit(recurrence,event,rule,{valid});return;}
    const multi=el.closest?.('[data-ui-multi]');if(multi&&el.type==='checkbox'){updateMulti(multi);emit(multi,event,selection(multi));return;}
    const checks=el.closest?.('[data-ui-checks]');if(checks){emit(checks,event,selection(checks));return;}
    const completion=el.closest?.('[data-ui-completion]');if(completion){emit(completion,event,el.checked,{checked:el.checked});return;}
    const range=el.closest?.('[data-ui-range]');if(range){range.dataset.keep='false';emit(range,event,updateRange(range),{phase:'change'});return;}
    const window=el.closest?.('[data-ui-time-window]');if(window){const start=window.querySelector('[name=start]'),end=window.querySelector('[name=end]');emit(window,event,{start:start.value,end:end.value},{valid:start.checkValidity()&&end.checkValidity()});return;}
    const dates=el.closest?.('[data-ui-date-range]');if(dates){const start=dates.querySelector('[name=start]'),end=dates.querySelector('[name=end]');end.min=start.value;emit(dates,event,{start:start.value,end:end.value},{valid:start.checkValidity()&&end.checkValidity()});return;}
    const season=el.closest?.('[data-ui-season]');if(season){const enabled=season.querySelector('[data-season-enabled]').checked;season.querySelector('.season-dates').hidden=!enabled;const fields=[...season.querySelectorAll('input:not([type=checkbox])')];fields.forEach(f=>{f.disabled=!enabled;f.setCustomValidity(enabled&&!parseMonthDay(f.value)?'Bitte ein gültiges Datum als TT.MM. eingeben.':'');});emit(season,event,{enabled,start:parseMonthDay(fields[0].value),end:parseMonthDay(fields[1].value)},{valid:!enabled||fields.every(f=>f.checkValidity())});return;}
    const backup=el.closest?.('[data-ui-backup]');if(backup&&el.type==='file'&&el.files?.[0]){
      const file=el.files[0],box=backup.querySelector('[data-backup-feedback]');box.textContent='Datei wird gelesen …';
      try{const value=await readJSONFile(file,{maxBytes:Number(backup.dataset.maxBytes)});if(disposed||!backup.isConnected)return;box.replaceChildren();emit(backup,event,value,{file});}catch(error){if(!disposed&&backup.isConnected)box.innerHTML=feedback(error.message,{kind:'error'});}el.value='';return;
    }
    const photo=el.closest?.('[data-ui-photo]');if(photo&&el.type==='file'&&el.files?.[0]){
      const token={};photoTokens.set(photo,token);const controls=[...photo.querySelectorAll('button,input')].filter(n=>!n.disabled);controls.forEach(n=>n.disabled=true);const status=photo.querySelector('[data-photo-status]'),error=photo.querySelector('[data-photo-error]');error.replaceChildren();status.textContent='Foto wird aufbereitet …';
      try{const src=await compressPhoto(el.files[0]);if(disposed||!photo.isConnected||photoTokens.get(photo)!==token)return;photo.querySelector('[data-photo-preview]').innerHTML=photoPreview({src});photo.querySelector('[data-ui-photo-remove]').hidden=false;status.textContent='Foto bereit.';emit(photo,event,src);}catch(err){if(!disposed&&photo.isConnected&&photoTokens.get(photo)===token){status.textContent='Bitte ein anderes Foto wählen.';error.innerHTML=feedback(err.message,{kind:'error'});}}finally{controls.forEach(n=>n.disabled=false);el.value='';}return;
    }
  };
  const colour=(control,x,y,event)=>{
    const radius=Math.hypot(x,y);if(radius>1){x/=radius;y/=radius;}
    const rgb=hsvToRGB((Math.atan2(x,-y)*180/Math.PI+360)%360,Math.min(1,radius)),hex='#'+rgb.map(n=>n.toString(16).padStart(2,'0')).join('');control.dataset.rgb=rgb.join(',');
    Object.assign(control.querySelector('.colour-marker').style,{left:(50+x*50)+'%',top:(50+y*50)+'%',background:hex});control.querySelector('[data-colour-swatch]').style.background=hex;control.querySelector('output').textContent=hex.toUpperCase();emit(control,event,rgb,{hex});
  };
  const pointer=event=>{
    const wheel=event.target.closest?.('.colour-wheel');if(!wheel||wheel.getAttribute('aria-disabled')==='true'||event.isPrimary===false)return;
    if(event.type==='pointermove'&&!wheel.hasPointerCapture(event.pointerId))return;
    if(event.type==='pointerdown'){if(event.button!==0)return;wheel.setPointerCapture(event.pointerId);wheel.focus();}
    const r=wheel.getBoundingClientRect();if(!r.width)return;event.preventDefault();colour(wheel.closest('[data-ui-colour]'),(event.clientX-r.left-r.width/2)/(r.width/2),(event.clientY-r.top-r.height/2)/(r.height/2),event);
  };
  const keydown=event=>{
    const el=event.target,combo=el.closest?.('[data-ui-combobox]');
    if(combo&&el.matches('input')){
      if(event.key==='Tab'){closeCombo(combo);return;}
      if(event.key==='Escape'&&el.getAttribute('aria-expanded')==='true'){event.preventDefault();event.stopPropagation();closeCombo(combo);return;}
      if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();if(el.getAttribute('aria-expanded')!=='true')openCombo(combo);const list=options(combo),index=list.findIndex(n=>n.classList.contains('active')),next=event.key==='ArrowDown'?Math.min(index+1,list.length-1):Math.max(index-1,0);list.forEach(n=>n.classList.remove('active'));if(list[next]){list[next].classList.add('active');el.setAttribute('aria-activedescendant',list[next].id);list[next].scrollIntoView({block:'nearest'});}return;}
      if(event.key==='Enter'&&el.getAttribute('aria-expanded')==='true'){event.preventDefault();const list=options(combo),selected=list.find(n=>n.classList.contains('active'))||(list.length===1?list[0]:null);if(selected)choose(combo,selected,event);return;}
    }
    const wheel=el.closest?.('.colour-wheel');if(wheel&&wheel.getAttribute('aria-disabled')!=='true'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)){
      event.preventDefault();const control=wheel.closest('[data-ui-colour]'),{h,s}=rgbToHSV(control.dataset.rgb.split(',').map(Number)),a=h*Math.PI/180,step=event.shiftKey?.1:.02;let x=Math.sin(a)*s,y=-Math.cos(a)*s;
      if(event.key==='Home'){x=0;y=0;}else if(event.key==='End'){x=Math.sin(a);y=-Math.cos(a);}else if(event.key==='ArrowLeft')x-=step;else if(event.key==='ArrowRight')x+=step;else if(event.key==='ArrowUp')y-=step;else y+=step;
      colour(control,x,y,event);
    }
  };
  const focusin=event=>{const box=event.target.closest?.('[data-ui-combobox]');if(box&&event.target.matches('input'))openCombo(box);};
  const outside=event=>{root.querySelectorAll('[data-ui-combobox]').forEach(box=>{if(!box.contains(event.target))closeCombo(box);});};
  const focusout=event=>{const box=event.target.closest?.('[data-ui-combobox]');if(box&&event.relatedTarget&&!box.contains(event.relatedTarget))closeCombo(box);};
  const listeners={click,input,change,keydown,focusin,focusout,pointerdown:pointer,pointermove:pointer};
  for(const [type,fn] of Object.entries(listeners))root.addEventListener(type,fn);
  root.addEventListener('pointerdown',outside);const observer=new MutationObserver(init);observer.observe(root,{childList:true,subtree:true});init();
  return ()=>{disposed=true;observer.disconnect();for(const [type,fn] of Object.entries(listeners))root.removeEventListener(type,fn);root.removeEventListener('pointerdown',outside);};
}

/** Source: Essensplaner horizontal swipe, Gartenarbeit top-of-page pull. Opt-in per surface. */
export function bindGestures(element,{onSwipeLeft,onSwipeRight,onPullDown,canPull=()=>!element.getRootNode().querySelector?.('dialog[open]')&&(element.ownerDocument.defaultView.scrollY<=0),swipeThreshold=60,pullThreshold=85}={}) {
  let start=null;
  const touchstart=event=>{const target=event.target;start=event.touches.length===1&&!target.closest?.('input,select,textarea,button,a,.colour-wheel')?[event.touches[0].clientX,event.touches[0].clientY,canPull()]:null;};
  const cancel=()=>{start=null;};
  const touchend=event=>{if(!start||!event.changedTouches.length)return;const [x,y,pull]=start;start=null;const dx=event.changedTouches[0].clientX-x,dy=event.changedTouches[0].clientY-y;if(Math.abs(dx)>swipeThreshold&&Math.abs(dx)>Math.abs(dy)*1.2)(dx<0?onSwipeLeft:onSwipeRight)?.();else if(pull&&dy>pullThreshold&&dy>Math.abs(dx)*1.2)onPullDown?.();};
  element.addEventListener('touchstart',touchstart,{passive:true});element.addEventListener('touchend',touchend,{passive:true});element.addEventListener('touchcancel',cancel,{passive:true});
  return ()=>{cancel();element.removeEventListener('touchstart',touchstart);element.removeEventListener('touchend',touchend);element.removeEventListener('touchcancel',cancel);};
}


/** Presentation only. Authorization, account and speaker selection remain in the application. */
export function musicActionButton({label,action,icon:mediaIcon,disabled=false,data={},pressed}) {
  let markup=iconButton({label,action,icon:'media-'+mediaIcon,disabled,data});
  if(pressed!==undefined)markup=markup.replace('<button ',`<button aria-pressed="${Boolean(pressed)}" `);
  if(mediaIcon==='star'&&pressed===false)markup=markup.replace('ui-icon filled','ui-icon');
  return markup;
}
export function musicArtwork({src='',kind='music'}={}) {
  let safe='';try{const url=new URL(src,'https://home-assistant.local');if(src&&['http:','https:'].includes(url.protocol)&&!url.username&&!url.password)safe=src;}catch{}
  return `<span class="fui-music-artwork" aria-hidden="true">${icon(kind==='radio'?'media-radio':'media-music')}${safe?`<img src="${escapeHtml(safe)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}</span>`;
}
export function musicPlayerHeader({title='',description='',speaker='',speakerSelect=null,artwork='',radio=false,hideSpeaker=false,settingsAction='player-settings',disabled=false}) {
  const choice=hideSpeaker?'<span aria-hidden="true"></span>':speakerSelect?`<div class="fui-player-speaker${speakerSelect.compact?' fui-player-speaker-compact':''}">${selectField({id:speakerSelect.id,label:'Box',hideLabel:true,value:speakerSelect.value,options:speakerSelect.options,disabled:disabled||speakerSelect.disabled}).replace('<select ', '<select aria-label="Box" ')}</div>`:`<span class="fui-player-name" aria-label="Box">${escapeHtml(speaker)}</span>`;
  const settings=iconButton({label:'Einstellungen',icon:'settings',action:settingsAction,disabled}).replace('class="edit-button"','class="edit-button fui-player-settings"');
  return `<div class="fui-player-toolbar">${choice}${settings}</div><div class="fui-player-heading">${musicArtwork({src:artwork,kind:radio?'radio':'music'})}<div><h3>${escapeHtml(title)}</h3><small>${escapeHtml(description)}</small></div></div>`;
}
export function musicTransport({controls=[]}={}) {
  if(!controls.length)return '';
  return `<div class="fui-music-transport" aria-label="Wiedergabe">${controls.map(control=>{let markup=musicActionButton(control);if(control.action==='play-pause')markup=markup.replace('class="edit-button"','class="edit-button fui-music-play"');return markup;}).join('')}</div>`;
}
export function musicFavoriteTile({label,action='play-favorite',data={},artwork='',kind='music',disabled=false}) {
  return button({label,action,data,disabled}).replace('class=""','class="fui-music-favorite"').replace('<button ',`<button aria-label="${escapeHtml(label+' abspielen')}" title="${escapeHtml(label)}" `).replace(`<span>${escapeHtml(label)}</span>`,musicArtwork({src:artwork,kind}));
}
