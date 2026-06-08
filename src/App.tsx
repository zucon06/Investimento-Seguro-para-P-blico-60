/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import extenso from 'extenso';
import { 
  Eye, QrCode, CreditCard, Wallet, Shield, HeadphonesIcon, 
  Moon, CheckCircle, Lock, TrendingUp, Clock, Calendar, 
  HelpCircle, ChevronRight, Fingerprint, KeyRound, AlertCircle, X,
  Phone, Video, MessageSquare, Info, Home, User, ReceiptText, ArrowUpRight, ArrowDownRight, Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { InvestmentData, ScreenName, InvestmentOption } from './types';
import { 
  PageWrapper, ContentWrapper, Header, Title, Subtitle, 
  Button, SelectableCard, ProgressBar, HelpLink, cn 
} from './SharedUI';

const INITIAL_DATA: InvestmentData = {
  accessibleMode: false,
  goal: '',
  timeframe: '',
  risk: '',
  selectedOption: null,
  value: '',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('HOME');
  const [data, setData] = useState<InvestmentData>(INITIAL_DATA);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [infoTopic, setInfoTopic] = useState<'NONE' | 'RISK' | 'OPTIONS' | 'FIXED_INCOME'>('NONE');

  const navigate = (screen: ScreenName) => setCurrentScreen(screen);
  const updateData = (updates: Partial<InvestmentData>) => setData(prev => ({ ...prev, ...updates }));

  // --- Screens ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onNavigate={navigate} accessibleMode={data.accessibleMode} onHelp={() => setIsHelpOpen(true)} />;
      case 'EXTRATO':
        return <ExtratoScreen onNavigate={navigate} accessibleMode={data.accessibleMode} />;
      case 'PERFIL':
        return <PerfilScreen onNavigate={navigate} accessibleMode={data.accessibleMode} updateData={updateData} data={data} />;
      case 'WELCOME':
        return <WelcomeScreen onNavigate={navigate} updateData={updateData} data={data} />;
      case 'ACCESSIBLE_MODE':
        return <AccessibleModeScreen onNavigate={navigate} updateData={updateData} data={data} />;
      case 'SECURITY_CHECK':
        return <SecurityCheckScreen onNavigate={navigate} data={data} onHelp={() => setIsHelpOpen(true)} />;
      case 'GOAL_SELECTION':
        return <GoalSelectionScreen onNavigate={navigate} updateData={updateData} data={data} onHelp={() => setIsHelpOpen(true)} />;
      case 'PROFILE_QUESTIONS':
        return <ProfileQuestionsScreen onNavigate={navigate} updateData={updateData} data={data} onHelp={() => setIsHelpOpen(true)} onShowInfo={(t) => setInfoTopic(t)} />;
      case 'RECOMMENDATIONS':
        return <RecommendationsScreen onNavigate={navigate} updateData={updateData} data={data} onHelp={() => setIsHelpOpen(true)} onShowInfo={(t) => setInfoTopic(t)} />;
      case 'INVESTMENT_DETAILS':
        return <InvestmentDetailsScreen onNavigate={navigate} data={data} onHelp={() => setIsHelpOpen(true)} onShowInfo={(t) => setInfoTopic(t)} />;
      case 'INSERT_VALUE':
        return <InsertValueScreen onNavigate={navigate} updateData={updateData} data={data} onHelp={() => setIsHelpOpen(true)} />;
      case 'REVIEW':
        return <ReviewScreen onNavigate={navigate} data={data} onHelp={() => setIsHelpOpen(true)} />;
      case 'AUTHENTICATION':
        return <AuthenticationScreen onNavigate={navigate} data={data} />;
      case 'SUCCESS':
        return <SuccessScreen onNavigate={navigate} data={data} />;
      default:
        return <HomeScreen onNavigate={navigate} accessibleMode={data.accessibleMode} />;
    }
  };

  return (
    <PageWrapper className={data.accessibleMode ? 'accessible-mode' : ''}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} data={data} />}
        {infoTopic !== 'NONE' && <InfoModal onClose={() => setInfoTopic('NONE')} topic={infoTopic} accessibleMode={data.accessibleMode} />}
      </AnimatePresence>
    </PageWrapper>
  );
}

// ==========================================
// INDIVIDUAL SCREENS
// ==========================================

function BottomNavigation({ currentTab, onNavigate }: { currentTab: 'HOME' | 'EXTRATO' | 'PERFIL', onNavigate: (s: ScreenName) => void }) {
  return (
    <nav className="bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center pb-safe z-10 w-full shrink-0">
      <button 
        onClick={() => onNavigate('HOME')}
        className={cn("flex flex-col items-center justify-center p-2 transition-colors", currentTab === 'HOME' ? "px-6 rounded-2xl bg-[#71f27a] text-green-900" : "text-text-muted hover:text-primary")}
      >
        <Home className={cn("w-6 h-6 mb-1", currentTab === 'HOME' ? "text-green-900" : "")} />
        <span className={cn("text-xs font-medium", currentTab === 'HOME' ? "text-sm font-semibold" : "")}>Início</span>
      </button>
      <button 
        onClick={() => onNavigate('WELCOME')}
        className="flex flex-col items-center justify-center p-2 text-text-muted hover:text-primary transition-colors"
      >
        <TrendingUp className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Investir</span>
      </button>
      <button 
        onClick={() => onNavigate('EXTRATO')}
        className={cn("flex flex-col items-center justify-center p-2 transition-colors", currentTab === 'EXTRATO' ? "px-6 rounded-2xl bg-[#71f27a] text-green-900" : "text-text-muted hover:text-primary")}
      >
        <ReceiptText className={cn("w-6 h-6 mb-1", currentTab === 'EXTRATO' ? "text-green-900" : "")} />
        <span className={cn("text-xs font-medium", currentTab === 'EXTRATO' ? "text-sm font-semibold" : "")}>Extrato</span>
      </button>
      <button 
        onClick={() => onNavigate('PERFIL')}
        className={cn("flex flex-col items-center justify-center p-2 transition-colors", currentTab === 'PERFIL' ? "px-6 rounded-2xl bg-[#71f27a] text-green-900" : "text-text-muted hover:text-primary")}
      >
        <User className={cn("w-6 h-6 mb-1", currentTab === 'PERFIL' ? "text-green-900" : "")} />
        <span className={cn("text-xs font-medium", currentTab === 'PERFIL' ? "text-sm font-semibold" : "")}>Perfil</span>
      </button>
    </nav>
  );
}

function HomeScreen({ onNavigate, accessibleMode, onHelp }: { onNavigate: (s: ScreenName) => void, accessibleMode: boolean, onHelp: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-slate-100 h-full">
      <div className="flex-1 overflow-y-auto w-full">
        <header className="p-6 bg-primary-dark text-white rounded-b-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-xl">Início</div>
            <button onClick={onHelp} className="p-2 bg-white/20 rounded-full">
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 mb-1">Saldo disponível</p>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">R$ 150.000,00</h2>
            <Eye className="w-6 h-6 text-blue-200" />
          </div>
          <Button onClick={() => onNavigate('EXTRATO')} variant="outline" className="mt-4 border-white/30 text-white hover:bg-white/10 py-3" accessible={accessibleMode}>
            Ver extrato completo
          </Button>
        </header>

        <div className="p-6 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-primary-dark mb-4 text-lg">Ações rápidas</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <QrCode />, label: 'Pix' },
                { icon: <Wallet />, label: 'Pagar' },
                { icon: <CreditCard />, label: 'Cartões' }
              ].map(item => (
                <button key={item.label} className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-2">
                    {item.icon}
                  </div>
                  <span className="font-medium text-text-main">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Novo
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              <h3 className="font-bold text-xl text-primary-dark">Investir com segurança</h3>
            </div>
            <p className="text-text-muted mb-6">Aplique seu dinheiro com orientação passo a passo, sem complicação e com total transparência.</p>
            <Button onClick={() => onNavigate('WELCOME')} className="bg-emerald-600 hover:bg-emerald-700 w-full flex items-center justify-center gap-2" accessible={accessibleMode}>
              Conhecer opções <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          <button onClick={onHelp} className="w-full bg-white rounded-2xl p-4 flex items-center shadow-sm text-left hover:bg-slate-50 transition-colors">
             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-primary shrink-0 mr-4">
               <HeadphonesIcon />
             </div>
             <div className="flex-1">
               <p className="font-bold text-primary-dark">Precisa de ajuda?</p>
               <p className="text-text-muted text-sm">Fale com um atendente agora.</p>
             </div>
             <ChevronRight className="text-slate-400" />
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation currentTab="HOME" onNavigate={onNavigate} />
    </div>
  );
}

function ExtratoScreen({ onNavigate, accessibleMode }: { onNavigate: (s: ScreenName) => void, accessibleMode: boolean }) {
  const transactions = [
    { id: 1, type: 'Transferência Recebida (Venda da Casa)', amount: 'R$ 150.000,00', date: 'Hoje, 10:15', positive: true, name: 'Imobiliária' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full">
      <div className="flex-1 overflow-y-auto w-full">
        <header className="p-6 bg-primary-dark text-white rounded-b-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-xl">Extrato e Lançamentos</h1>
            <ReceiptText className="text-white/80" />
          </div>
          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
            <p className="text-blue-100 text-sm mb-1">Entradas em Maio</p>
            <h3 className="text-2xl font-bold text-emerald-400">+ R$ 150.000,00</h3>
          </div>
        </header>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className={cn("font-bold text-primary-dark", accessibleMode ? "text-xl" : "text-lg")}>Histórico</h3>
            <button className="text-primary font-medium text-sm hover:underline">Filtrar</button>
          </div>

          <div className="space-y-4">
            {transactions.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", t.positive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}>
                    {t.positive ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={cn("font-bold text-text-main leading-tight", accessibleMode ? "text-lg" : "text-base")}>{t.type}</p>
                    <p className="text-text-muted text-sm">{t.name} • {t.date}</p>
                  </div>
                </div>
                <div className={cn("font-bold", t.positive ? "text-emerald-600" : "text-text-main", accessibleMode ? "text-lg" : "text-base")}>
                  {t.positive ? '+' : '-'} {t.amount}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="mt-4" accessible={accessibleMode}>Ver lançamentos mais antigos</Button>
        </div>
      </div>
      
      <BottomNavigation currentTab="EXTRATO" onNavigate={onNavigate} />
    </div>
  );
}

function PerfilScreen({ onNavigate, accessibleMode, updateData, data }: { onNavigate: (s: ScreenName) => void, accessibleMode: boolean, updateData: any, data: InvestmentData }) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-6 pt-12 flex flex-col items-center bg-primary-dark text-white rounded-b-3xl shadow-md">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 text-white text-3xl font-bold border-4 border-white">
            <User className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold">Olá, Neusa!</h2>
          <p className="text-blue-200 mt-1">Conta: 1947679-9 • Agência: 0001</p>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <h3 className="px-5 p-4 border-b border-slate-100 font-bold text-primary-dark text-lg bg-slate-50">Configurações e Segurança</h3>
            <div className="divide-y divide-slate-100">
               <div className="flex items-center justify-between p-5">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center shrink-0">
                     <Moon className="w-5 h-5" />
                   </div>
                   <div>
                     <p className={cn("font-bold text-text-main", accessibleMode ? "text-lg" : "text-base")}>Modo acessível</p>
                     <p className="text-sm text-text-muted">Letras maiores e contraste</p>
                   </div>
                 </div>
                 <button 
                  className={cn("w-14 h-8 rounded-full transition-colors relative", data.accessibleMode ? "bg-primary" : "bg-slate-300")}
                  onClick={() => updateData({ accessibleMode: !data.accessibleMode })}
                  role="switch"
                  aria-checked={data.accessibleMode}
                >
                  <div className={cn("w-6 h-6 bg-white rounded-full absolute top-1 transition-transform", data.accessibleMode ? "translate-x-7" : "translate-x-1")} />
                </button>
               </div>
               
               <button className="w-full flex items-center p-5 hover:bg-slate-50 transition-colors">
                 <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center shrink-0 mr-3">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
                 <div className="text-left flex-1">
                   <p className={cn("font-bold text-text-main", accessibleMode ? "text-lg" : "text-base")}>Senhas e segurança</p>
                 </div>
                 <ChevronRight className="text-slate-400" />
               </button>
               
               <button className="w-full flex items-center p-5 hover:bg-slate-50 transition-colors">
                 <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center shrink-0 mr-3">
                   <Settings className="w-5 h-5" />
                 </div>
                 <div className="text-left flex-1">
                   <p className={cn("font-bold text-text-main", accessibleMode ? "text-lg" : "text-base")}>Ajustes da conta</p>
                 </div>
                 <ChevronRight className="text-slate-400" />
               </button>
            </div>
          </div>
          
          <button className="w-full flex items-center p-5 bg-white border border-red-100 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-colors shadow-sm gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            Sair da minha conta
          </button>

        </div>
      </div>
      
      <BottomNavigation currentTab="PERFIL" onNavigate={onNavigate} />
    </div>
  );
}

function WelcomeScreen({ onNavigate, updateData, data }: { onNavigate: (s: ScreenName) => void, updateData: any, data: InvestmentData }) {
  return (
    <>
      <Header title="Investimentos" onBack={() => onNavigate('HOME')} showHelp={false} />
      <ContentWrapper className="justify-center items-center text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <Title className="mb-4">Vamos investir com segurança</Title>
        <Subtitle className="mb-10 max-w-[280px]">
          Você será guiado passo a passo antes de confirmar qualquer operação. Nada será feito acidentalmente.
        </Subtitle>

        <div className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl mb-8 shadow-sm">
          <div className="flex items-center gap-3 text-left">
            <Moon className="w-6 h-6 text-primary" />
            <div>
              <p className="font-bold text-primary-dark">Modo acessível</p>
              <p className="text-sm text-text-muted">Letras maiores e mais contraste</p>
            </div>
          </div>
          <button 
            className={cn("w-14 h-8 rounded-full transition-colors relative", data.accessibleMode ? "bg-primary" : "bg-slate-300")}
            onClick={() => updateData({ accessibleMode: !data.accessibleMode })}
            role="switch"
            aria-checked={data.accessibleMode}
          >
            <div className={cn("w-6 h-6 bg-white rounded-full absolute top-1 transition-transform", data.accessibleMode ? "translate-x-7" : "translate-x-1")} />
          </button>
        </div>

        <div className="w-full space-y-4 mt-auto">
          <Button onClick={() => onNavigate('SECURITY_CHECK')} accessible={data.accessibleMode}>Começar</Button>
          <Button variant="outline" accessible={data.accessibleMode}>Preciso de ajuda</Button>
        </div>
      </ContentWrapper>
    </>
  );
}

function AccessibleModeScreen({ onNavigate, updateData, data }: any) {
  // Merged into Welcome for better flow as requested by typical modern UX, 
  // but if explicit screen is needed, we could use it here.
  // The requirements say "Tela 3: Modo acessível", but having it in Welcome as a toggle (as in my WelcomeScreen) is often preferred.
  // Let's implement it as a separate screen just to strictly follow the prompt if needed, 
  // actually the prompt mockup might just be a question.
  // Let's skip to SECURITY_CHECK from welcome based on the switch. 
  // I'll keep this empty and handle it in Welcome to save steps, it's better UX.
  return null;
}

function SecurityCheckScreen({ onNavigate, data, onHelp }: { onNavigate: (s: ScreenName) => void, data: InvestmentData, onHelp: () => void }) {
  return (
    <>
      <Header title="Investimentos" onBack={() => onNavigate('WELCOME')} onHelp={onHelp} />
      <ContentWrapper className="items-center text-center justify-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <Title className="mb-4">Ambiente seguro</Title>
        <Subtitle className="mb-10">Você está no ambiente oficial do banco.</Subtitle>

        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl w-full text-left flex gap-4 mb-20 shadow-sm">
          <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <p className={cn("text-primary-dark font-medium leading-relaxed", data.accessibleMode ? "text-lg" : "text-base")}>
            O banco <strong>nunca</strong> pede senha por ligação, mensagem ou WhatsApp.
          </p>
        </div>

        <div className="w-full space-y-4 mt-auto">
          <Button onClick={() => onNavigate('GOAL_SELECTION')} accessible={data.accessibleMode}>Entendi e quero continuar</Button>
          <Button variant="ghost" onClick={onHelp} accessible={data.accessibleMode}>Falar com atendente</Button>
        </div>
      </ContentWrapper>
    </>
  );
}

function GoalSelectionScreen({ onNavigate, updateData, data, onHelp }: any) {
  const options = [
    { id: 'guardar', label: 'Guardar com segurança', icon: <Lock /> },
    { id: 'render', label: 'Render mais que a poupança', icon: <TrendingUp /> },
    { id: 'breve', label: 'Usar em breve', icon: <Clock /> },
    { id: 'longo', label: 'Deixar aplicado por longo tempo', icon: <Calendar /> },
  ];

  return (
    <>
      <Header title="Passo 1 de 5" onBack={() => onNavigate('SECURITY_CHECK')} onHelp={onHelp} />
      <ContentWrapper>
        <ProgressBar current={1} total={5} />
        <Title>Qual é o seu objetivo?</Title>
        <Subtitle className="mb-4">Escolha a opção que mais combina com você no momento.</Subtitle>

        <div className="space-y-3 flex-1 overflow-y-auto pb-4">
          {options.map(opt => (
            <SelectableCard
              key={opt.id}
              title={opt.label}
              icon={opt.icon}
              selected={data.goal === opt.id}
              onClick={() => updateData({ goal: opt.id })}
              accessible={data.accessibleMode}
            />
          ))}
        </div>

        <HelpLink onClick={onHelp} />
        <Button 
          disabled={!data.goal} 
          onClick={() => onNavigate('PROFILE_QUESTIONS')}
          accessible={data.accessibleMode}
        >
          Continuar
        </Button>
      </ContentWrapper>
    </>
  );
}

function ProfileQuestionsScreen({ onNavigate, updateData, data, onHelp, onShowInfo }: any) {
  return (
    <>
      <Header title="Passo 2 de 5" onBack={() => onNavigate('GOAL_SELECTION')} onHelp={onHelp} />
      <ContentWrapper>
        <ProgressBar current={2} total={5} />
        <div className="flex-1 overflow-y-auto pb-4">
          <Title className="mb-4">Quando você pretende usar esse dinheiro?</Title>
          <div className="space-y-3 mb-8">
            {['Posso precisar a qualquer momento', 'Em até 1 ano', 'Em mais de 1 ano'].map(opt => (
              <SelectableCard
                key={opt}
                title={opt}
                selected={data.timeframe === opt}
                onClick={() => updateData({ timeframe: opt })}
                accessible={data.accessibleMode}
              />
            ))}
          </div>

          <Title className="mb-4">Você aceita algum risco?</Title>
          <div className="space-y-3">
            {['Não, quero o mais seguro', 'Aceito pouco risco', 'Não sei responder'].map(opt => (
              <SelectableCard
                key={opt}
                title={opt}
                selected={data.risk === opt}
                onClick={() => updateData({ risk: opt })}
                accessible={data.accessibleMode}
              />
            ))}
          </div>
          
          <button onClick={() => onShowInfo('RISK')} className="mt-6 text-primary font-medium hover:underline flex items-center gap-2">
            <HelpCircle className="w-5 h-5"/> O que significa aceitar risco?
          </button>
        </div>

        <Button 
          disabled={!data.timeframe || !data.risk} 
          onClick={() => onNavigate('RECOMMENDATIONS')}
          accessible={data.accessibleMode}
        >
          Ver opções recomendadas
        </Button>
      </ContentWrapper>
    </>
  );
}

function RecommendationsScreen({ onNavigate, updateData, data, onHelp, onShowInfo }: any) {
  const allOptions: InvestmentOption[] = [
    { id: 'cdb_liq', title: 'CDB Liquidez Diária', desc: 'Segurança com resgate imediato', type: 'Renda Fixa', riskLevel: 'Baixo Risco', rescue: 'Imediato', timeframe: 'Livre', iconKey: 'Clock' },
    { id: 'tesouro_selic', title: 'Tesouro Direto Selic', desc: 'Garantido pelo governo, o mais seguro', type: 'Renda Fixa', riskLevel: 'Muito Baixo', rescue: 'Em 1 dia útil', timeframe: 'Livre', iconKey: 'Shield' },
    { id: 'lci', title: 'LCI Isenta de IR', desc: 'Sem imposto de renda, para prazos longos', type: 'Renda Fixa', riskLevel: 'Baixo Risco', rescue: 'No vencimento', timeframe: 'Fechado (ex: 1 ano)', iconKey: 'Calendar' },
    { id: 'fundo_mod', title: 'Fundo Moderado', desc: 'Busca render mais com leve risco', type: 'Fundo de Investimento', riskLevel: 'Médio Risco', rescue: 'Em 30 dias', timeframe: 'Longo prazo', iconKey: 'TrendingUp' },
    { id: 'cdb_pre', title: 'CDB Prefixado', desc: 'Saiba exatamente quanto vai receber', type: 'Renda Fixa', riskLevel: 'Baixo Risco', rescue: 'No vencimento', timeframe: 'Fechado (ex: 2 anos)', iconKey: 'TrendingUp' },
  ];

  let options: InvestmentOption[] = [];

  if (data.risk === 'Aceito pouco risco') {
    options = [
      { ...allOptions.find(o => o.id === 'fundo_mod')!, tag: 'Recomendado' },
      allOptions.find(o => o.id === 'tesouro_selic')!,
      allOptions.find(o => o.id === 'cdb_liq')!
    ];
  } else if (data.timeframe === 'Posso precisar a qualquer momento') {
    options = [
      { ...allOptions.find(o => o.id === 'cdb_liq')!, tag: 'Recomendado' },
      allOptions.find(o => o.id === 'tesouro_selic')!
    ];
  } else if (data.timeframe === 'Em até 1 ano') {
    options = [
      { ...allOptions.find(o => o.id === 'tesouro_selic')!, tag: 'Recomendado' },
      allOptions.find(o => o.id === 'cdb_pre')!,
      allOptions.find(o => o.id === 'cdb_liq')!
    ];
  } else {
    options = [
      { ...allOptions.find(o => o.id === 'lci')!, tag: 'Recomendado' },
      allOptions.find(o => o.id === 'cdb_pre')!,
      allOptions.find(o => o.id === 'tesouro_selic')!
    ];
  }
  options = options.filter(Boolean);

  const getIcon = (key: string) => {
    switch (key) {
      case 'Shield': return <Shield />;
      case 'Clock': return <Clock />;
      case 'TrendingUp': return <TrendingUp />;
      case 'Calendar': return <Calendar />;
      default: return <Shield />;
    }
  };

  const handleSelect = (opt: InvestmentOption) => {
    updateData({ selectedOption: opt });
    onNavigate('INVESTMENT_DETAILS');
  };

  return (
    <>
      <Header title="Passo 3 de 5" onBack={() => onNavigate('PROFILE_QUESTIONS')} onHelp={onHelp} />
      <ContentWrapper>
        <ProgressBar current={3} total={5} />
        <Title>Encontramos opções para você</Title>
        <Subtitle className="mb-4">Compare com calma antes de escolher o investimento.</Subtitle>

        <button onClick={() => onShowInfo('OPTIONS')} className="text-primary font-medium hover:underline flex items-center gap-2 mb-4 w-full">
            <HelpCircle className="w-5 h-5"/> O que significam essas opções?
        </button>

        <div className="space-y-4 flex-1 overflow-y-auto pb-4">
          {options.map(opt => (
            <div key={opt.id} className="bg-white border-2 border-slate-200 rounded-2xl p-5 relative shadow-sm overflow-hidden pt-6">
              {opt.tag && (
                <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase whitespace-nowrap">
                  {opt.tag}
                </div>
              )}
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-primary mr-4 shrink-0">
                  {getIcon(opt.iconKey)}
                </div>
                <div>
                  <h3 className={cn("font-bold text-primary-dark", data.accessibleMode ? "text-xl" : "text-lg")}>{opt.title}</h3>
                  <p className={cn("text-text-muted mt-1", data.accessibleMode ? "text-base" : "text-sm")}>{opt.desc}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => handleSelect(opt)} accessible={data.accessibleMode}>
                Ver detalhes
              </Button>
            </div>
          ))}
        </div>
      </ContentWrapper>
    </>
  );
}

function InvestmentDetailsScreen({ onNavigate, data, onHelp, onShowInfo }: any) {
  const opt = data.selectedOption as InvestmentOption;
  if (!opt) return null;

  return (
    <>
      <Header title="Passo 4 de 5" onBack={() => onNavigate('RECOMMENDATIONS')} onHelp={onHelp} />
      <ContentWrapper>
        <ProgressBar current={4} total={5} />
        <Title>Detalhes do investimento</Title>
        <div className="inline-block bg-blue-100 text-primary-dark font-bold px-4 py-2 rounded-full w-max mb-4">{opt.type}</div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Shield className="w-6 h-6 text-primary mr-4" />
            <div>
              <p className="text-sm text-text-muted">Risco</p>
              <p className={cn("font-bold text-primary-dark", data.accessibleMode ? "text-lg" : "text-base")}>{opt.riskLevel}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Clock className="w-6 h-6 text-primary mr-4" />
            <div>
              <p className="text-sm text-text-muted">Resgate</p>
              <p className={cn("font-bold text-primary-dark", data.accessibleMode ? "text-lg" : "text-base")}>{opt.rescue}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Calendar className="w-6 h-6 text-primary mr-4" />
            <div>
              <p className="text-sm text-text-muted">Prazo</p>
              <p className={cn("font-bold text-primary-dark", data.accessibleMode ? "text-lg" : "text-base")}>{opt.timeframe}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8 shadow-sm">
          <h3 className={cn("font-bold text-primary-dark mb-2", data.accessibleMode ? "text-xl" : "text-lg")}>O que vai acontecer com seu dinheiro?</h3>
          <p className="text-text-muted leading-relaxed">
            O valor sairá da sua conta corrente e ficará aplicado neste investimento. Você poderá acompanhar os rendimentos todos os dias pelo aplicativo.
          </p>
          {opt.type === 'Renda Fixa' && (
            <button onClick={() => onShowInfo('FIXED_INCOME')} className="mt-4 text-primary font-medium hover:underline flex items-center gap-2">
              <HelpCircle className="w-5 h-5"/> O que significa renda fixa?
            </button>
          )}
        </div>

        <div className="mt-auto space-y-4">
          <Button onClick={() => onNavigate('INSERT_VALUE')} accessible={data.accessibleMode}>Escolher este investimento</Button>
          <HelpLink onClick={onHelp} />
        </div>
      </ContentWrapper>
    </>
  );
}

function InsertValueScreen({ onNavigate, updateData, data, onHelp }: any) {
  const [inputValue, setInputValue] = useState('');
  const [extensoVal, setExtensoVal] = useState('');
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setInputValue('');
      setExtensoVal('');
      updateData({ value: '' });
      return;
    }
    const valObj = (parseInt(raw, 10) / 100);
    const formatted = valObj.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    setInputValue(formatted);
    updateData({ value: formatted });
    
    try {
      setExtensoVal(extenso(valObj, { mode: 'currency' }));
    } catch (e) {
      setExtensoVal('');
    }
  };

  const hasValue = inputValue.length > 0 && inputValue !== 'R$ 0,00';

  return (
    <>
      <Header title="Passo 5 de 5" onBack={() => onNavigate('INVESTMENT_DETAILS')} onHelp={onHelp} />
      <ContentWrapper>
        <ProgressBar current={5} total={5} />
        <Title className="mb-6">Quanto você deseja investir?</Title>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm mb-6 focus-within:border-primary transition-colors">
          <label className="block text-text-muted font-medium mb-4">Valor do investimento</label>
          <input 
            type="text"
            inputMode="numeric"
            className="w-full text-4xl font-bold text-primary-dark outline-none bg-transparent placeholder-slate-300"
            placeholder="R$ 0,00"
            value={inputValue}
            onChange={handleInput}
            autoFocus
          />
          {hasValue && extensoVal && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-primary italic font-medium">{extensoVal}</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 text-blue-900 p-4 rounded-xl flex gap-3 mb-auto">
          <Info className="w-6 h-6 shrink-0 text-primary" />
          <p className="font-medium text-sm md:text-base">Confira se o valor digitado está correto antes de continuar. Não se preocupe, você ainda poderá revisar tudo.</p>
        </div>

        <div className="mt-8 space-y-4">
          <Button disabled={!hasValue} onClick={() => onNavigate('REVIEW')} accessible={data.accessibleMode}>Continuar</Button>
          <Button variant="outline" onClick={() => setInputValue('')} accessible={data.accessibleMode}>Limpar valor</Button>
        </div>
      </ContentWrapper>
    </>
  );
}

function ReviewScreen({ onNavigate, data, onHelp }: any) {
  const opt = data.selectedOption as InvestmentOption;
  
  return (
    <>
      <Header title="Revisão" onBack={() => onNavigate('INSERT_VALUE')} onHelp={onHelp} />
      <ContentWrapper>
        <Title className="mb-6">Revise antes de confirmar</Title>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-100">
            <p className="text-text-muted text-sm mb-1">Valor do investimento</p>
            <p className={cn("font-bold text-primary-dark", data.accessibleMode ? "text-3xl" : "text-2xl")}>
              {data.value || 'R$ 150.000,00'}
            </p>
          </div>
          <div className="p-5 border-b border-slate-100 flex justify-between">
            <span className="text-text-muted font-medium">Produto</span>
            <span className="font-bold text-primary-dark text-right max-w-[60%]">{opt?.title}</span>
          </div>
          <div className="p-5 border-b border-slate-100 flex justify-between">
            <span className="text-text-muted font-medium">Tipo</span>
            <span className="font-bold text-primary-dark text-right">{opt?.type}</span>
          </div>
          <div className="p-5 border-b border-slate-100 flex justify-between">
            <span className="text-text-muted font-medium">Risco</span>
            <span className="font-bold text-primary-dark text-right">{opt?.riskLevel}</span>
          </div>
          <div className="p-5 flex justify-between border-b border-slate-100">
            <span className="text-text-muted font-medium">Resgate</span>
            <span className="font-bold text-primary-dark text-right">{opt?.rescue}</span>
          </div>
          <div className="p-5 bg-slate-50">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-text-muted">O dinheiro sairá da sua conta corrente e ficará aplicado de forma segura.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex gap-4 shadow-sm mb-8">
          <AlertCircle className="w-8 h-8 text-red-600 shrink-0" />
          <p className="text-red-900 font-semibold leading-relaxed">
            Atenção: Confirme apenas se você reconhece completamente esta operação.
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <Button variant="secondary" onClick={() => onNavigate('AUTHENTICATION')} accessible={data.accessibleMode}>Confirmar com segurança</Button>
          <Button variant="outline" onClick={() => onNavigate('INSERT_VALUE')} accessible={data.accessibleMode}>Voltar e alterar dados</Button>
          <HelpLink onClick={onHelp} text="Falar com atendente" />
        </div>
      </ContentWrapper>
    </>
  );
}

function AuthenticationScreen({ onNavigate, data }: any) {
  // Simulating loading authentication
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'biometria' | 'senha' | null>(null);

  const handleAuth = () => {
    if (!method) return;
    setLoading(true);
    setTimeout(() => {
      onNavigate('SUCCESS');
    }, 1500);
  };

  return (
    <>
      <Header title="Confirmação final" onBack={() => onNavigate('REVIEW')} showHelp={false} />
      <ContentWrapper className="items-center text-center justify-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-primary-dark" />
        </div>
        <Title className="mb-4">Confirmação final</Title>
        <Subtitle className="mb-10 max-w-[280px]">Para a sua total segurança, confirme que é você quem está realizando esta operação.</Subtitle>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 my-10">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            <p className="text-primary-dark font-medium animate-pulse">Autenticando...</p>
          </div>
        ) : (
          <div className="w-full space-y-4 mb-auto">
            <button 
              onClick={() => setMethod('biometria')}
              className={cn("w-full p-6 bg-white border-2 rounded-2xl shadow-sm transition-colors flex flex-col items-center justify-center gap-3", method === 'biometria' ? 'border-primary text-primary bg-blue-50' : 'border-slate-200 text-text-main hover:border-slate-300')}
            >
              <Fingerprint className={cn("w-10 h-10", method === 'biometria' ? 'text-primary' : 'text-slate-500')} />
              <span className="font-bold text-lg">Usar Biometria</span>
            </button>
            <button 
              onClick={() => setMethod('senha')}
              className={cn("w-full p-6 bg-white border-2 rounded-2xl shadow-sm transition-colors flex flex-col items-center justify-center gap-3", method === 'senha' ? 'border-primary text-primary bg-blue-50' : 'border-slate-200 text-text-main hover:border-slate-300')}
            >
              <KeyRound className={cn("w-10 h-10", method === 'senha' ? 'text-primary' : 'text-slate-500')} />
              <span className="font-bold text-lg">Usar senha do app</span>
            </button>
          </div>
        )}

        {!loading && (
          <div className="w-full mt-8 flex flex-col gap-3">
            <Button onClick={handleAuth} disabled={!method} accessible={data.accessibleMode}>
              Confirmar
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('HOME')} accessible={data.accessibleMode}>
              Cancelar operação
            </Button>
          </div>
        )}
      </ContentWrapper>
    </>
  );
}

function SuccessScreen({ onNavigate, data }: any) {
  const date = new Date().toLocaleDateString('pt-BR');
  return (
    <>
      <Header title="Comprovante" showHelp={false} />
      <ContentWrapper className="items-center text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white mt-4">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <Title className="mb-2">Investimento realizado com sucesso!</Title>
        <Subtitle className="mb-8">Seu dinheiro foi aplicado com total segurança.</Subtitle>

        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-left relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
           <div className="flex justify-between items-end border-b border-slate-100 pb-4 mb-4">
             <div>
               <p className="text-text-muted text-sm mb-1">Valor investido</p>
               <p className={cn("font-bold text-primary-dark", data.accessibleMode ? "text-2xl" : "text-xl")}>{data.value || 'R$ 150.000,00'}</p>
             </div>
           </div>
           <div className="flex justify-between items-center mb-4">
             <span className="text-text-muted">Data</span>
             <span className="font-semibold text-primary-dark">{date}</span>
           </div>
           <div className="flex justify-between items-center mb-4 text-left">
             <span className="text-text-muted mr-4">Produto</span>
             <span className="font-semibold text-primary-dark text-right">{data.selectedOption?.title || 'CDB Renda Fixa'}</span>
           </div>
           <div className="border-t border-slate-100 pt-4 mt-2">
             <p className="text-center text-xs text-slate-400 font-mono tracking-widest uppercase">AUT-98237498-BNC</p>
           </div>
        </div>

        <div className="w-full space-y-4 mt-auto">
          <Button onClick={() => {}} accessible={data.accessibleMode}>Baixar comprovante PDF</Button>
          <Button variant="outline" onClick={() => onNavigate('HOME')} accessible={data.accessibleMode}>Acompanhar investimento</Button>
          <Button variant="ghost" onClick={() => onNavigate('HOME')} accessible={data.accessibleMode}>Voltar para o Início</Button>
        </div>
      </ContentWrapper>
    </>
  );
}

function HelpModal({ onClose, data }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center px-4"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <Title>Como podemos ajudar?</Title>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
            <X className="w-6 h-6 text-text-main" />
          </button>
        </div>
        
        <p className="text-text-muted mb-6 text-lg">
          Não se preocupe, estamos aqui para te ajudar. Escolha uma opção para falar conosco:
        </p>

        <div className="space-y-3 overflow-y-auto pb-4">
          {[
            { icon: <Phone />, label: 'Falar por voz', desc: 'Ligue grátis para um atendente' },
            { icon: <Video />, label: 'Chamada de vídeo', desc: 'Fale cara a cara de forma segura' },
            { icon: <MessageSquare />, label: 'Chat com especialista', desc: 'Tire dúvidas por texto' }
          ].map(opt => (
             <button key={opt.label} className="w-full p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-primary hover:bg-blue-50 transition-all flex items-center text-left">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary shrink-0 mr-4">
                 {opt.icon}
               </div>
               <div className="flex-1">
                 <h4 className={cn("font-bold text-primary-dark", data.accessibleMode ? "text-xl" : "text-lg")}>{opt.label}</h4>
                 <p className={cn("text-text-muted mt-1", data.accessibleMode ? "text-base" : "text-sm")}>{opt.desc}</p>
               </div>
               <ChevronRight className="text-slate-400" />
             </button>
          ))}
        </div>

        <Button className="mt-4" onClick={onClose} accessible={data.accessibleMode}>
          Voltar para a operação
        </Button>
      </motion.div>
    </motion.div>
  );
}

function InfoModal({ onClose, topic, accessibleMode }: { onClose: () => void, topic: 'RISK' | 'OPTIONS' | 'FIXED_INCOME', accessibleMode: boolean }) {
  let title = "";
  let content = null;

  if (topic === 'RISK') {
    title = "O que significa risco?";
    content = (
      <>
        <p className={cn("text-text-muted mb-4 leading-relaxed", accessibleMode ? "text-lg" : "text-base")}>
          Risco é a chance de o valor do seu dinheiro oscilar ou de o seu investimento render menos que o esperado.
        </p>
        <ul className="space-y-4">
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex shrink-0 items-center justify-center mt-0.5"><Shield className="w-5 h-5"/></div>
            <div>
              <strong className={cn("text-primary-dark font-semibold block", accessibleMode ? "text-lg" : "text-base")}>Opções mais seguras</strong>
              <span className={cn("text-text-muted", accessibleMode ? "text-base" : "text-sm")}>O valor investido é protegido e não diminui. O rendimento é constante. Exemplos: Renda Fixa, Poupança.</span>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex shrink-0 items-center justify-center mt-0.5"><TrendingUp className="w-5 h-5"/></div>
            <div>
              <strong className={cn("text-primary-dark font-semibold block", accessibleMode ? "text-lg" : "text-base")}>Opções com risco</strong>
              <span className={cn("text-text-muted", accessibleMode ? "text-base" : "text-sm")}>Você pode ganhar mais, mas o valor do seu investimento varia diariamente e pode ficar negativo (diminuir) em alguns dias.</span>
            </div>
          </li>
        </ul>
      </>
    );
  } else if (topic === 'OPTIONS') {
    title = "O que significam essas opções?";
    content = (
      <>
        <ul className="space-y-5">
           <li>
              <strong className={cn("text-primary-dark font-semibold block", accessibleMode ? "text-lg" : "text-base")}>Mais seguro (Renda Fixa)</strong>
              <span className={cn("text-text-muted", accessibleMode ? "text-base" : "text-sm")}>Garante que o valor investido não vai diminuir. É a escolha de quem prefere dormir tranquilo, mesmo que o lucro seja um pouquinho menor.</span>
           </li>
           <li>
              <strong className={cn("text-primary-dark font-semibold block", accessibleMode ? "text-lg" : "text-base")}>Acesso rápido (Resgate imediato)</strong>
              <span className={cn("text-text-muted", accessibleMode ? "text-base" : "text-sm")}>Opção para guardar um dinheiro que você pode precisar sacar a qualquer hora do dia ou da noite para emergências.</span>
           </li>
           <li>
              <strong className={cn("text-primary-dark font-semibold block", accessibleMode ? "text-lg" : "text-base")}>Melhor rendimento</strong>
              <span className={cn("text-text-muted", accessibleMode ? "text-base" : "text-sm")}>Gera mais lucros ao longo do tempo, mas pode ter variações ou exigir que o dinheiro fique guardado por meses antes de poder ser retirado.</span>
           </li>
        </ul>
      </>
    );
  } else if (topic === 'FIXED_INCOME') {
    title = "O que é Renda Fixa?";
    content = (
      <>
        <p className={cn("text-text-muted mb-4 leading-relaxed", accessibleMode ? "text-lg" : "text-base")}>
          A Renda Fixa é como se você estivesse emprestando seu dinheiro para o banco.
        </p>
        <p className={cn("text-text-muted mb-4 leading-relaxed", accessibleMode ? "text-lg" : "text-base")}>
          Em troca desse empréstimo, o banco devolve o valor para você com juros depois de um certo tempo.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex gap-3 text-emerald-800">
           <Shield className="w-6 h-6 shrink-0 text-emerald-600" />
           <p className={cn("font-medium", accessibleMode ? "text-lg" : "text-base")}>
             A principal vantagem é a segurança. Você já sabe desde o começo as regras de como seu dinheiro vai crescer e não corre risco de perder o valor investido.
           </p>
        </div>
      </>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center px-4"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <Title className="pr-4">{title}</Title>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 shrink-0">
            <X className="w-6 h-6 text-text-main" />
          </button>
        </div>
        
        <div className="overflow-y-auto pb-4">
          {content}
        </div>

        <Button className="mt-4" onClick={onClose} accessible={accessibleMode}>
          Entendi, voltar
        </Button>
      </motion.div>
    </motion.div>
  );
}

