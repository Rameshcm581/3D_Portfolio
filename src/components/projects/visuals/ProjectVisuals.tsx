import React from 'react';
import {
  Activity,
  CheckCircle,
  Clock,
  Mail,
  ShieldCheck,
  ShoppingCart,
  Barcode,
  Search,
  Sparkles,
  BookOpen,
  Eye,
  Crosshair
} from 'lucide-react';
import './ProjectVisuals.css';

/**
 * SITEWATCH: Custom Monitoring Visualization
 * Uptime checks, TLS/domain expiry, scheduled execution, alerts
 */
export const SiteWatchVisual: React.FC = () => {
  return (
    <div className="project-custom-visual sitewatch-visual">
      {/* Visual Window Header */}
      <div className="visual-window-bar">
        <div className="window-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="window-title-tag">
          <Activity size={12} className="text-gold" />
          <span>SiteWatch Health Engine • APScheduler Daemon</span>
        </div>
        <span className="live-status-pill">
          <span className="status-dot-pulse" />
          <span>Active</span>
        </span>
      </div>

      <div className="visual-content-body">
        {/* Scheduled Uptime Check Row */}
        <div className="vis-panel uptime-panel">
          <div className="panel-header-row">
            <span className="panel-label">Endpoint Uptime Verification</span>
            <span className="interval-tag">
              <Clock size={11} />
              <span>Interval: 5 min</span>
            </span>
          </div>

          <div className="endpoint-status-row">
            <div className="endpoint-badge">
              <span className="http-method">GET</span>
              <span className="endpoint-url">https://api.target-host.org/health</span>
            </div>
            <div className="http-status-ok">
              <CheckCircle size={13} />
              <span>200 OK</span>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="uptime-timeline-bar">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="timeline-slice slice-healthy"
                title={`Check ${i + 1}: Healthy`}
              />
            ))}
          </div>
          <div className="timeline-caption-row">
            <span>Last 24 checks verified</span>
            <span className="uptime-percent">100% Availability</span>
          </div>
        </div>

        {/* Dual Split: TLS Expiry & Alert Channels */}
        <div className="vis-dual-grid">
          {/* TLS Expiry */}
          <div className="vis-panel tls-panel">
            <div className="panel-header-row">
              <span className="panel-label">TLS / Domain Expiry</span>
              <ShieldCheck size={14} className="text-gold" />
            </div>
            <div className="tls-details">
              <span className="tls-domain">production-gateway.org</span>
              <div className="tls-validity-row">
                <span className="tls-cert-tag">TLS 1.3 Active</span>
                <span className="tls-days-tag">Expires in 74 Days</span>
              </div>
              <span className="tls-note">Recurring daily expiry audit active</span>
            </div>
          </div>

          {/* Alert Delivery Service */}
          <div className="vis-panel alert-panel">
            <div className="panel-header-row">
              <span className="panel-label">Alert Dispatch Pipeline</span>
              <Mail size={14} className="text-cyan" />
            </div>
            <div className="alert-details">
              <div className="alert-channel-row">
                <span className="channel-icon-pill">SendGrid</span>
                <span className="channel-status">Ready</span>
              </div>
              <p className="alert-action-text">
                Automated email dispatch configured for downtime and approaching cert renewal.
              </p>
              <div className="ci-badge-row">
                <span className="ci-tag">GitHub Actions CI</span>
                <span className="ci-tag">Playwright Tests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * RETAIL MANAGEMENT: Point-of-Sale (POS) & Multi-Tenant Inventory Mockup
 * Tasteful POS mockup demonstrating billing, barcode scanning, and multi-tenant isolation
 */
export const RetailManagementVisual: React.FC = () => {
  return (
    <div className="project-custom-visual retail-visual">
      {/* Mockup Window Bar */}
      <div className="visual-window-bar">
        <div className="window-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="window-title-tag">
          <ShoppingCart size={12} className="text-gold" />
          <span>Retail POS Terminal • Interface Mockup</span>
        </div>
        <span className="tenant-context-tag">
          <span>Tenant: Store #104</span>
        </span>
      </div>

      <div className="visual-content-body">
        {/* Register Top Bar */}
        <div className="pos-register-header">
          <div className="barcode-input-mock">
            <Barcode size={14} className="text-gold" />
            <span className="barcode-text">SKU-8901032 • Scanner Input Ready</span>
          </div>
          <span className="rbac-badge">Role: Store Manager</span>
        </div>

        {/* Line Items Table Mockup */}
        <div className="pos-items-table">
          <div className="table-row table-header">
            <span>Item Description</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
          </div>
          <div className="table-row">
            <span className="item-name">Thermal Receipt Paper (Roll of 10)</span>
            <span className="text-center">2</span>
            <span className="text-right">₹340.00</span>
          </div>
          <div className="table-row">
            <span className="item-name">Laser Barcode Scanner Gun</span>
            <span className="text-center">1</span>
            <span className="text-right">₹2,450.00</span>
          </div>
          <div className="table-row">
            <span className="item-name">Barcode Shelf Labels (Pack 500)</span>
            <span className="text-center">4</span>
            <span className="text-right">₹720.00</span>
          </div>
        </div>

        {/* Calculation & Tender Breakdown */}
        <div className="pos-summary-bar">
          <div className="pos-calc-col">
            <div className="calc-row">
              <span>Subtotal:</span>
              <span>₹3,510.00</span>
            </div>
            <div className="calc-row">
              <span>Configurable Tax (CGST + SGST 9%):</span>
              <span>₹631.80</span>
            </div>
            <div className="calc-row total-row">
              <span>Total Payable:</span>
              <span className="total-amount">₹4,141.80</span>
            </div>
          </div>

          <div className="pos-features-col">
            <span className="features-label">Platform Capabilities:</span>
            <div className="pos-pill-group">
              <span className="pos-chip">Wholesale & Retail</span>
              <span className="pos-chip">Multi-Tax Workflows</span>
              <span className="pos-chip">Granular RBAC</span>
              <span className="pos-chip">Subscription Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * THIRUKURAL RAG: Semantic Retrieval Pipeline Diagram
 * Visualizes user scenario entering vector retrieval and yielding matching couplet
 */
export const ThirukuralRagVisual: React.FC = () => {
  return (
    <div className="project-custom-visual rag-visual">
      {/* Window Bar */}
      <div className="visual-window-bar">
        <div className="window-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="window-title-tag">
          <Search size={12} className="text-gold" />
          <span>Semantic RAG Retrieval Pipeline</span>
        </div>
        <span className="pipeline-engine-tag">
          <span>Qdrant + sentence-transformers</span>
        </span>
      </div>

      <div className="visual-content-body">
        {/* Step 1: User Scenario Input */}
        <div className="rag-stage-card stage-input">
          <div className="stage-step-tag">Step 1 • Scenario Query</div>
          <div className="user-query-bubble">
            <span className="query-quote">"</span>
            <span>How should an engineering leader handle disputes fairly without personal bias?</span>
            <span className="query-quote">"</span>
          </div>
        </div>

        {/* Step 2: Vector Embedding & Tagging */}
        <div className="rag-flow-arrow">
          <span className="arrow-line" />
          <span className="arrow-label">LLM Scenario Tagging & Dense Embedding Generation</span>
          <span className="arrow-line" />
        </div>

        <div className="rag-stage-card stage-vector">
          <div className="stage-step-tag">Step 2 • Semantic Vector Search</div>
          <div className="vector-meta-row">
            <div className="tags-cluster">
              <span className="rag-tag">#Leadership</span>
              <span className="rag-tag">#Impartiality</span>
              <span className="rag-tag">#Justice</span>
              <span className="rag-tag">#Equanimity</span>
            </div>
            <div className="qdrant-score">
              <Sparkles size={12} className="text-gold" />
              <span>Cosine Similarity: 0.91</span>
            </div>
          </div>
        </div>

        {/* Step 3: Ranked Couplet Output */}
        <div className="rag-stage-card stage-output">
          <div className="output-header-row">
            <div className="stage-step-tag">Step 3 • Ranked Couplet Result</div>
            <span className="kural-num">Couplet #561</span>
          </div>
          <div className="kural-tamil-text">
            "ஓர்ந்துக்கண் ணோடாது இறைபுரிந்து யார்மாட்டும் தேர்ந்துசெய் வஃதே முறை."
          </div>
          <p className="kural-explanation">
            To examine the truth, show no partiality, and administer justice after mature consideration is the duty of good leadership.
          </p>
          <div className="kural-eval-row">
            <BookOpen size={12} className="text-muted" />
            <span>Retrieval quality verified via recall@K on hand-curated test scenarios</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * BRAIN TUMOR DETECTION: Computer Vision Detection Workflow Illustration
 * Visualizes YOLOv8 bounding box localization without fabricating medical claims
 */
export const BrainTumorVisual: React.FC = () => {
  return (
    <div className="project-custom-visual cv-visual">
      {/* Window Bar */}
      <div className="visual-window-bar">
        <div className="window-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="window-title-tag">
          <Eye size={12} className="text-gold" />
          <span>YOLOv8 Detection & Bounding-Box Workflow</span>
        </div>
        <span className="cv-framework-tag">
          <span>PyTorch • OpenCV</span>
        </span>
      </div>

      <div className="visual-content-body">
        {/* Detection Frame with Overlay */}
        <div className="cv-preview-frame">
          <div className="mri-scan-canvas">
            <div className="mri-grid-lines" />
            <div className="mri-anatomy-placeholder">
              {/* Coordinate Reticle */}
              <div className="crosshair-marker marker-tl" />
              <div className="crosshair-marker marker-tr" />
              <div className="crosshair-marker marker-bl" />
              <div className="crosshair-marker marker-br" />

              {/* Bounding Box Simulation */}
              <div className="yolo-bounding-box">
                <div className="bbox-label-tag">
                  <Crosshair size={11} />
                  <span>Suspected Region [Class: Lesion]</span>
                </div>
                <div className="bbox-coords">x:134 y:186 w:92 h:88</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Progression Stages */}
        <div className="cv-pipeline-stages">
          <div className="pipeline-step">
            <span className="step-num">1</span>
            <span className="step-text">Image Preprocessing & Augmentation</span>
          </div>
          <div className="pipeline-step">
            <span className="step-num">2</span>
            <span className="step-text">YOLOv8 Feature Extraction</span>
          </div>
          <div className="pipeline-step">
            <span className="step-num">3</span>
            <span className="step-text">Bounding-Box Localization</span>
          </div>
        </div>

        {/* Educational Scope Notice */}
        <div className="cv-scope-notice">
          <span>Technical Study:</span> Trained and evaluated on annotated open-access MRI datasets for computer-vision localization and bounding-box interpretability.
        </div>
      </div>
    </div>
  );
};
