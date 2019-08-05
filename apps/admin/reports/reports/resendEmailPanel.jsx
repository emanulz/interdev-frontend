import React from 'react'
import { connect } from 'react-redux'
import { getItemDispatch } from '../../../../utils/api'

@connect(store=>{
    return {

        notify_emails: store.generalReports.notify_emails,
        panel_visible: store.generalReports.resend_email_panel_visible,
        mailing_target: store.generalReports.mailing_target,
        mail_body: store.generalReports.mail_body,
        mail_subject: store.generalReports.mail_subject

    }
})
export default class ResendEmailPanelComponent extends React.Component {



    onCancel(){
        this.props.dispatch({type:"TOGGLE_REPORT_MAILING_PANEL"})
    }

    requestEmailDispatch(){
        const _id = this.props.mailing_target.id

        const mails = this.props.notify_emails

        const kwargs = {
            url: `/api/asyncreporting/resend_report/?id=${_id}&emails=${mails}&subject=${this.props.mail_subject}&body=${this.props.mail_body}`,
            successType: "MAILING_REPORTS_SUCCESSFUL",
            errorType: "MAILING_REPORTS_REJECTED"
        }

        this.props.dispatch(getItemDispatch(kwargs))

    }

    _onNotifyEmailsChange(e){
        this.props.dispatch({type: 'SET_NOTIFY_EMAILS', payload: e.target.value})
    }

    _onSubjectChange(e){
        this.props.dispatch({type: 'SET_MAIL_SUBJECT', payload: e.target.value})
    }

    _onBodyChange(e){
        this.props.dispatch({type: 'SET_MAIL_BODY', payload: e.target.value})
    }

    render(){

        const panel_root_class = this.props.panel_visible===true ? 'rep-req' : 'rep-panel-hidden'
        return <div className={panel_root_class}>
            <div className="rep-req-body">
                <h1 className="rep-req-body-title">Enviar Reporte por Correo</h1>

                <p className="rep-req-body-legend">Especificar uno o más destinatarios del correo. El asunto y cuerpo del mensaje son
                    opcionales.</p>
                
                <div className="rep-req-body-email">
                    <div className="rep-req-body-title-2">Enviar reporte a correos, lista separada por comas:</div>
                    <input type="text" className="form-control rep-req-body-email-input" 
                    value={this.props.notify_emails}
                    onChange={this._onNotifyEmailsChange.bind(this)}/>
                </div>

                <div className="rep-req-body-email">
                    <div className="rep-req-body-title-2">Asunto Correo:</div>
                    <input type="text" className="form-control rep-req-body-email-input" 
                    value={this.props.mail_subject}
                    onChange={this._onSubjectChange.bind(this)}/>
                </div>

                <div className="rep-req-body-email">
                    <div className="rep-req-body-title-2">Cuerpo Correo:</div>
                    <textarea type="text" className="form-control rep-req-body-email-input" 
                    value={this.props.mail_body}
                    onChange={this._onBodyChange.bind(this)}/>
                </div>


                <div className="rep-req-body-actions">
                    <button onClick={this.requestEmailDispatch.bind(this)}
                        className='btn btn-success rep-req-body-actions-btn'>
                            ENVIAR CORREO
                    </button>
                    <button onClick={this.onCancel.bind(this)}
                        className='btn btn-danger rep-req-body-actions-btn'>
                            CANCELAR
                        <span>
                            <i className='fa fa-cross' />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    }

}



