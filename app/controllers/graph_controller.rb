class GraphController < AdminController
  def index
    @require = require_statement
    @demand = demand_statement
    #logger.debug JSON.pretty_generate(@condition_obj)
    
    
    g = graph_data(nil)
    @nodes = g[:nodes]
    @links = g[:links] || []
    
  end
  
  def list_entry_points
  end

  def get_node
    @node=@account.nodes.find(params[:id])
    render :node, :layout=>false
  end

  def get_edge
    @edge = @account.edges.find(params[:id])
    render :edge, :layout=>false
  end

  def set_node
    if params[:id].present?
      node = @account.nodes.find(params[:id])
      node.name = params[:name] unless @account.nodes.find_by_name(params[:name])
      if params[:do_delete]
        node.destroy
      else
        node.save 
      end
    else
      @account.nodes << Node.create(name:params[:name]) if params[:name].present? && !@account.nodes.find_by_name(params[:name])
    end
    
    render :json=> graph_data(@account.nodes.find_by_name(params[:name]))
  end

  def set_edge
    node_a = @account.nodes.find(params[:nodeA])
    node_b = @account.nodes.find(params[:nodeB])
    edge = @account.edges.find_by_source_id_and_target_id(node_a.id, node_b.id) || Edge.create(:source_id=>node_a.id, :target_id=>node_b.id, :account_id=>@account.id)
    gd = graph_data(nil)
    logger.debug gd.inspect
    render :json=> gd
  end

  def list_rules
    @rules = params[:node_id].present? ? @account.nodes.find(params[:node_id]).rules : @account.edges.find(params[:edge_id]).rules
    render :rules, :layout=>false
  end

  def get_rule
    @rule = params[:id].present? ? @account.rules.find(params[:id]) : Rule.new
    @node=@account.nodes.find(params[:node_id]) if params[:node_id].present?
    @edge=@account.edges.find(params[:edge_id]) if params[:edge_id].present?
    @require = require_statement
    @demand = demand_statement
    render :rule, :layout=>false
  end

  def set_rule
    logger.debug "#"*40
    rule = params[:id].present? ? @account.rules.find(params[:id]) : Rule.create(:account_id=>@account.id)
    
    rule.requirement = params[:requirement].reject{|cnd| cnd==""}
    rule.demand = params[:demand].reject{|dmd| dmd==""}
    logger.debug "#"*40
    rule.relate_to_node(params[:node_id]) if params[:node_id].present?
    rule.relate_to_edge(params[:edge_id]) if params[:edge_id].present?
    logger.debug "#"*40
    if rule.requirement.empty? 
      rule.destroy
    else
      unless rule.save
        logger.debug rule.error
      end
    end
    
    if params[:edge_id].present?
      redirect_to :action=>:get_edge, :id => params[:edge_id]
    else
      redirect_to :action=>:get_node, :id => params[:node_id]
    end
  end
  
  def set_code
    element = params[:node_id].present? ? @account.nodes.find(params[:node_id]) : @account.edges.find(params[:edge_id])
    element.code_cache = params[:code]
    element.expert_mode=true;
    element.save
    
    render :json=> {:res=>element.save}
  end
  
  
  private # private # private # private # private # private # private # private # private # 
  
  def graph_data(entry)
    nodes = {}
    @account.nodes.each{|n| nodes[n.id]={:id=>n.id, :name=>n.name}}
    {
      :nodes=>nodes,
      :links=>@account.edges.map{|e| {:id=>e.id,:source=>e.source_id, :target=>e.target_id, :type=>"suit"}}
    }
  end
  
  
  
  
  #TODO: make these structures dynamicly generated out of a plugin list
  
  def require_statement
    operands = {"is"=>[],"not"=>[], "grater then"=>[],"lesser then"=>[]}
    regexp = {"starts with"=>[],"end_with"=>[], "contains"=>[],"equals"=>[],"expression"=>[]}
    #regexp = {"starts with"=>{[]=>{1=>[],2=>[]}},"end_with"=>[], "contains"=>[],"equals"=>[],"expression"=>[]}
    
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands, "with Code"=>regexp}
    { 
      Rule::IF_USER_EVENT=>value_type,
      Rule::IF_USER_EVENT_FRQ=>value_type,
      Rule::IF_USER_SCALE=>scales,
      Rule::IF_USER_HAS_BADGE=>badges,
      Rule::UNLESS_USER_HAS_BADGE=>badges
    }
  end
  
  def demand_statement
    operands = {"by (value)"=>[],"by event value and factored by"=>[]}
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands, "with Scale"=>scales}
    
    { 
      Rule::UPSET_USER_SCALE=>scales,
      Rule::GRANT_USER_BADGE=>badges,
      Rule::REVOKE_USER_BADGE=>badges,
      Rule::SEND_NOTIFICATION=>@account.notifications.map{|n| n.name}
    }
  end
  
  
  

end
