class GraphController < AdminController
  def index
    @require = require_statement
    @demand = demand_statement
    #logger.debug JSON.pretty_generate(@condition_obj)
    @nodes = {}
    ["Gilad","HTC","Microsoft","Samsung","Motorola","Nokia", "Kodak","Apple","Barnes & Noble"].each{|n| @nodes[n.hash]={:id=>n.hash, :name=>n}}
    
    @links = [
      
      {:source=>"Microsoft".hash, :target=> "HTC".hash, :type=> "licensing"},
      {:source=>"Samsung".hash, :target=> "Apple".hash, :type=> "suit"},
      {:source=>"Motorola".hash, :target=> "Apple".hash, :type=> "suit"},
      {:source=>"Nokia".hash, :target=> "Apple".hash, :type=> "resolved"},
      {:source=>"HTC".hash, :target=> "Apple".hash, :type=> "suit"},
      {:source=>"Kodak".hash, :target=> "Apple".hash, :type=> "suit"},
      {:source=>"Apple".hash, :target=> "Kodak".hash, :type=> "resolved"},
      
      {:source=>"Microsoft".hash, :target=> "Barnes & Noble".hash, :type=> "suit"}
    ]
    
    g = graph_data(nil)
    @nodes = g[:nodes]
    @links = g[:links] || []
    
  end
  
  def list_entry_points
  end

  def get_node
    @node=@account.nodes.find(params[:id])
    @require = require_statement
    @demand = demand_statement
    render :node, :layout=>false
  end

  def get_edge
    @source = params[:source]
    @target = params[:target]
    @require = require_statement
    @demand = demand_statement
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

  def set_rule
    rule = params[:id].present? ? @account.rules.find(params[:id]) : Rule.create(:account_id=>@account.id)
    
    rule.require = params[:require].reject{|cnd| cnd==""}
    rule.demand = params[:demand].reject{|dmd| dmd==""}
    rule.relate_to_graph(params[:node_id],params[:edge_id])
    unless rule.save
      logger.debug rule.error
    end
    
    logger.debug params
    redirect_to :action=>:get_node, :id => params[:node_id]
  end
  
  
  private # private # private # private # private # private # private # private # private # 
  
  def graph_data(entry)
    nodes = {}
    @account.nodes.each{|n| nodes[n.id]={:id=>n.id, :name=>n.name}}
    {
      :nodes=>nodes,
      :links=>@account.edges.map{|e| {:source=>e.source_id, :target=>e.target_id, :type=>"suit"}}
    }
  end
  
  
  
  
  #TODO: make these structures dynamicly generated out of a plugin list
  
  def require_statement
    operands = {"is"=>[],"not"=>[], "grater then"=>[],"lesser then"=>[]}
    regexp = {"starts with"=>[],"end_with"=>[], "contains"=>[],"equals"=>[],"expression"=>[]}
    
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands, "with Code"=>regexp}
    { 
      Rule::IF_USER_EVENT=>value_type,
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
      Rule::SEND_NOTIFICATION=>[]
    }
  end
  
  
  

end
